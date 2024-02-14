// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./lib/AdminRole.sol";
import "./PepemonCardDeck.sol";
import "./lib/RewardPool.sol";
import "./lib/Elo.sol";
import "./iface/IPepemonCardOracle.sol";
import "./PepemonBattle.sol";

contract PepemonMatchmaker is ERC1155Holder, ERC721Holder, AdminRole {
    event BattleFinished(address indexed winner, address indexed loser, uint256 battleId);

    struct waitingDeckData {
        uint256 deckId;
        uint256 enterTimestamp;
    }

    address private _battleAddress;
    address private _deckAddress;
    address private _rewardPoolAddress;
    bool private _allowBattleAgainstOneself;
    bool private _pveMode;

    uint256 private immutable _defaultRanking;
    uint256 private _matchRange = 300;
    uint256 private _matchRangePerMinute = 1;
    uint256 private _kFactor = 16;

    mapping(uint256 => uint256) internal _waitingDecksIndex; // _waitingDecksIndex[deckId] -> index of waitingDecks
    mapping(uint256 => address) public deckOwner;
    waitingDeckData[] public waitingDecks;

    mapping(address => uint256) public playerRanking;
    address[] public leaderboardPlayers;

    constructor (uint256 defaultRanking, address battleAddress, address deckAddress, address rewardPoolAddress) {
        _defaultRanking = defaultRanking; // suggested: 2000
        _battleAddress = battleAddress;
        _deckAddress = deckAddress;
        _rewardPoolAddress = rewardPoolAddress;
        _allowBattleAgainstOneself = false;
    }

    function setPveMode(bool enable) public onlyAdmin {
        _pveMode = enable;
    }

    function addPveDeck(uint256 deckId) public onlyAdmin {
        require(_pveMode == true);

        // must be set, unless PvE requires no ranking (to be confirmed)
        if (playerRanking[msg.sender] == 0) {
            playerRanking[msg.sender] = _defaultRanking;
            leaderboardPlayers.push(msg.sender);
        }

        addWaitingDeck(deckId);
    }

    function removePveDeck(uint256 deckId) public onlyAdmin {
        require(_pveMode == true);
        removeWaitingDeck(deckId);
    }

    function setAllowBattleAgainstOneself(bool allow) public onlyAdmin {
        _allowBattleAgainstOneself = allow;
    }

    function setDeckContractAddress(address deckContractAddress) public onlyAdmin {
        _deckAddress = deckContractAddress;
    }

    function setBattleContractAddress(address battleContractAddress) public onlyAdmin {
        _battleAddress = battleContractAddress;
    }

    function setRewardPoolAddress(address rewardPoolAddress) public onlyAdmin {
        _rewardPoolAddress = rewardPoolAddress;
    }

    function setMatchRange(uint256 matchRange, uint256 matchRangePerMinute) public onlyAdmin {
        _matchRange = matchRange;
        _matchRangePerMinute = matchRangePerMinute;
    }

    function forceExit(uint256 deckId) public onlyAdmin {
        removeWaitingDeck(deckId);
    }

    /**
     * @dev Dictates the rate of change, has a direct influence on how much a player wins/loses in the ranking
     * @param kFactor Value used to calculate the rate of change in getEloRatingChange
     */
    function setKFactor(uint256 kFactor) public onlyAdmin {
        _kFactor = kFactor;
    }

    /**
     * @notice Tells whether or not this contract is operating in PvE mode. When in PvE mode, players cannot fight against
     * each other (because PvE is the opposite of PvP).
     */
    function isPveMode() public view returns(bool) {
        return _pveMode;
    }

    /**
     * @dev Returns the number of players currently on the leaderboard.
     * @return The number of players currently on the leaderboard.
     */
    function leaderboardPlayersCount() public view returns(uint256) {
        return leaderboardPlayers.length;
    }

    /**
     * @dev Returns the rankings and addresses of players on the leaderboard, within a given range of indices.
     * @param count The number of rankings to return.
     * @param offset The index of the first ranking to return.
     * @return addresses An array of player addresses corresponding to the returned rankings.
     * @return rankings An array of ranking values for the returned players.
     * @dev Requires that `count` is less than or equal to the number of players on the leaderboard minus `offset`, and that `offset` is less than the number of players on the leaderboard.
     */
    function getPlayersRankings(
        uint256 count,
        uint256 offset
    ) public view returns (address[] memory addresses, uint256[] memory rankings) {
        require(offset < leaderboardPlayers.length, "Invalid offset");
        
        if(count - offset > leaderboardPlayers.length) {
            count = leaderboardPlayers.length;
        }

        addresses = new address[](count);
        rankings = new uint256[](count);

        for (uint256 i = offset; i < offset + count; ++i) {
            address playerAddress = leaderboardPlayers[i];
            addresses[i - offset] = playerAddress;
            rankings[i - offset] = playerRanking[playerAddress];
        }
        return (addresses, rankings);
    }

    /**
     * @notice Tries to initiate a battle using a specified deck.
     * @dev This function tries to initiate a battle either in PvE or PvP depending on how the contract is operating. 
     * @param deckId The Deck of who called this function
     */
    function enter(uint256 deckId) public {
        require(msg.sender == PepemonCardDeck(_deckAddress).ownerOf(deckId), "PepemonMatchmaker: Not your deck");
        require(PepemonCardDeck(_deckAddress).getBattleCardInDeck(deckId) != 0, "PepemonMatchmaker: Invalid battlecard");

        // Make sure the player has the minimum amount of support cards required
        (,uint256 supportCardCount) = PepemonCardDeck(_deckAddress).decks(deckId);
        require(supportCardCount >= PepemonCardDeck(_deckAddress).MIN_SUPPORT_CARDS(), "PepemonMatchmaker: Not enough support cards");

        // If playerRanking is empty, set default ranking
        if (playerRanking[msg.sender] == 0) {
            playerRanking[msg.sender] = _defaultRanking;
            leaderboardPlayers.push(msg.sender);
        }

        if (_pveMode == false) {
            enterPvp(deckId);
        } else {
            enterPve(deckId);
        }
    }

    /**
     * @notice Tries to initiate a battle using a specified deck. Opponents are not other players but a set of decks added by admins.
     * @dev This function cannot be used if _pveMode is set to false.
     * @param deckId The Deck of the player
     */
    function enterPve(uint256 deckId) internal {
        // Get a matchmaking opponent
        uint256 opponentDeckId = getPveMatchmakingOpponent(deckId);

        // If one is found then start the battle, otherwise revert the transaction because someone forgot to add the opponents
        if (opponentDeckId > 0) {
            // start battle
            processMatch(deckId, opponentDeckId);
        } else {
            // should only happen if an admin forgot to add decks to this contract
            revert("PepemonMatchmaker: No PvE opponents available");
        }
    }

    /**
     * @notice Tries to initiate a battle using a specified deck. If no opponents are found, the deck
     * is placed in a wait list.
     * @dev This function cannot be used if _pveMode is set to true.
     * @param deckId The Deck of the player
     */
    function enterPvp(uint256 deckId) internal {
        // Try find matchmaking partner
        uint256 opponentDeckId = findMatchmakingOpponent(deckId);

        // If one is found then start the battle, otherwise put in a wait list
        if (opponentDeckId > 0) {
            // start battle
            processMatch(deckId, opponentDeckId);
            // prevent other matches from starting immediately after this one finishes
            removeWaitingDeck(opponentDeckId);
        } else {
            addWaitingDeck(deckId);
        }
    }

    /**
     * @notice Transfers a deck back to its owner and removes from the wait list
     * @param deckId The Deck of the owner
     */
    function exit(uint256 deckId) public {
        require(waitingDecks.length > 0 && waitingDecks[_waitingDecksIndex[deckId]].deckId != 0, "PepemonMatchmaker: Deck is not in the wait list");
        require(msg.sender == deckOwner[deckId], "PepemonMatchmaker: Not your deck");
        removeWaitingDeck(deckId);
    }

    /**
     * @notice Calculates the Elo change based on the winner's and loser's ratings.
     * @dev The returned number has 2 decimals of precision, so 1501 = 15.01 Elo change
     */
    function getEloRatingChange(uint256 winnerRating, uint256 loserRating) public view returns (uint256) {
        (uint256 change,) = Elo.ratingChange(winnerRating, loserRating, 100, _kFactor);
        return change;
    }

    /**
     * @notice Retrieves the number of waiting decks
     */
    function getWaitingCount() public view returns (uint256) {
        return waitingDecks.length;
    }

    /**
     * @notice Transfers a deck from its owner onto this contract, then adds the deck to the wait list
     * @param deckId The Deck of the owner
     */
    function addWaitingDeck(uint256 deckId) internal {
        deckOwner[deckId] = msg.sender;
        PepemonCardDeck(_deckAddress).safeTransferFrom(msg.sender, address(this), deckId, "");

        _waitingDecksIndex[deckId] = waitingDecks.length;
        waitingDecks.push(waitingDeckData(deckId, block.timestamp));
    }

    /**
     * @notice Removes a deck from the wait list
     * @dev Works by replacing the current element by the last element of the array. See https://stackoverflow.com/a/74668959
     * @param deckId The Deck of the owner
     */
    function removeWaitingDeck(uint256 deckId) internal {
        // Transfer deck back to owner
        PepemonCardDeck(_deckAddress).safeTransferFrom(address(this), deckOwner[deckId], deckId, "");
        delete deckOwner[deckId];

        uint256 lastItemIndex = waitingDecks.length - 1;

        uint256 lastDeckId = waitingDecks[lastItemIndex].deckId;

        // update the index of the item to be swapped 
        _waitingDecksIndex[lastDeckId] = _waitingDecksIndex[deckId];

        // swap the last item of the list with the one to be deleted
        waitingDecks[_waitingDecksIndex[deckId]] = waitingDecks[lastItemIndex];
        waitingDecks.pop();
        delete _waitingDecksIndex[deckId];
    }

    /**
     * @notice Performs the battle between player 1's and player 2's deck, sends a reward for the winner,
     * and ajust their ranking
     * @param player1deckId Deck of the first player
     * @param player2deckId Deck of the second player
     */
    function processMatch(uint256 player1deckId, uint256 player2deckId) internal {
        // Evaluate the battle winner
        (address winner, address loser, uint256 battleId) = doBattle(player1deckId, player2deckId);
        // Declare loser and winner
        emit BattleFinished(winner, loser, battleId);

        // Send a reward to the winner
        RewardPool(_rewardPoolAddress).sendReward(battleId, winner);

        // Adjust ranking accordingly. Change is adjusted to remove the extra precision from getEloRatingChange
        uint256 change = getEloRatingChange(playerRanking[winner], playerRanking[loser]) / 100;
        playerRanking[winner] += change;
        // Prevent underflow or rank reset if it gets below or equal to zero. Unlikely, but possible.
        if(int256(playerRanking[loser]) - int256(change) > 0) {
            playerRanking[loser] = playerRanking[loser] - change;
        } else {
            playerRanking[loser] = 1;
        }
    }

    /**
     * @dev Takes one random deckId from the waiting list, which in pve mode contains decks set by admins instead of other player's decks
     * @param deckId Deck of the current player trying to start a match, only used for added entropy
     * @return opponentDeckId Deck of the opponent, if any. 0 when none are available
     */
    function getPveMatchmakingOpponent(uint256 deckId) internal view returns (uint256) {
        if (waitingDecks.length == 0) {
            return 0;
        }
        // Take one of the random pve decks
        uint256 index = uint256(keccak256(abi.encodePacked(uint256(63), deckId, block.timestamp))) % waitingDecks.length;
        return waitingDecks[index].deckId;
    }

    /**
     * @dev Tries to find an opponent's deck based off all waiting player's ratings. The acceptable
     * difference between players ratings is increased over time by an amount defined by _matchRangePerMinute
     * @param deckId Deck of the current player trying to start a match
     * @return opponentDeckId Deck of the opponent, if found. 0 when not found
     */
    function findMatchmakingOpponent(uint256 deckId) internal view returns (uint256) {
        // Find a waiting deck with a ranking that is within matchRange
        for (uint256 i = 0; i < waitingDecks.length; ++i) {
            uint256 currentIterDeck = waitingDecks[i].deckId;

            // Skip own deck, as well as other decks of the same owner IF _allowBattleAgainstOneself is false
            if (i == deckId || (!_allowBattleAgainstOneself && msg.sender == deckOwner[currentIterDeck])) {
                continue;
            }

            // increase precision to allow increasing playerMatchRange every second
            uint256 mins = (120 * (block.timestamp - waitingDecks[i].enterTimestamp)) / 60;
            uint256 playerMatchRange = _matchRange + (mins * _matchRangePerMinute) / 120;
            // Assume deckOwner[deckId] is msg.sender, because we are not storing msg.sender in deckOwner[deckId], saving gas
            if (
                // instead of doing the following:
                // playerRanking[msg.sender] > (playerRanking[deckOwner[currentIterDeck]] - playerMatchRange) &&
                // we invert the math operation to avoid casting everything to int256, thus saving some gas
                (playerRanking[msg.sender] + playerMatchRange) > playerRanking[deckOwner[currentIterDeck]] &&
                playerRanking[msg.sender] < (playerRanking[deckOwner[currentIterDeck]] + playerMatchRange)
            ) {
                return waitingDecks[i].deckId;
            }
        }
        return 0;
    }

    /**
     * @dev Creates a new battle in the PepemonBattle contract and executes the battle logic
     * @param player1deckId Deck of the first player
     * @param player2deckId Deck of the second player
     * @return winner Address of the winner
     * @return loser Address of the loser
     * @return battleId Random seed generated for the battle
     */
    function doBattle(uint256 player1deckId, uint256 player2deckId) internal returns (address, address, uint256) {
        // Assume deckOwner[player1deckId] is msg.sender, because we are not storing msg.sender in deckOwner[player1deckId], saving gas
        (PepemonBattle.Battle memory battle, uint256 battleId) = PepemonBattle(_battleAddress).createBattle(
            msg.sender,
            player1deckId,
            deckOwner[player2deckId],
            player2deckId
        );
        (, address winner) = PepemonBattle(_battleAddress).goForBattle(battle);
        address loser = (winner == msg.sender ? deckOwner[player2deckId] : msg.sender);
        return (winner, loser, battleId);
    }
}
