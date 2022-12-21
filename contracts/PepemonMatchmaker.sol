// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PepemonCardDeck.sol";
import "./lib/RewardPool.sol";
import "./lib/Elo.sol";
import "./PepemonCardOracle.sol";
import "./PepemonBattle.sol";
import "hardhat/console.sol";

contract PepemonMatchmaker is ERC1155Holder, Ownable {
    event BattleFinished(address indexed winner, address indexed loser, uint256 battleId);

    struct waitingDeckData {
        uint256 deckId;
        uint256 enterTimestamp;
    }

    address private _battleAddress;
    address private _deckAddress;
    address private _rewardPoolAddress;

    uint16 private _defaultRanking = 2000;
    uint16 private _matchRange = 300;
    uint16 private _matchRangePerMinute = 1;

    mapping(uint256 => uint16) _waitingDecksIndex;
    mapping(uint256 => address) public deckOwner;
    waitingDeckData[] public waitingDecks;

    uint256 public _kFactor = 16;
    mapping(address => uint16) public playerRanking;

    // PUBLIC METHODS

    function setDeckContractAddress(address deckContractAddress) public onlyOwner {
        _deckAddress = deckContractAddress;
    }

    function setBattleContractAddress(address battleContractAddress) public onlyOwner {
        _battleAddress = battleContractAddress;
    }

    function setRewardPoolAddress(address rewardPoolAddress) public onlyOwner {
        _rewardPoolAddress = rewardPoolAddress;
    }

    // dictates how much a player wins/loses in the ranking
    function setKFactor(uint256 kFactor) public onlyOwner {
        _kFactor = kFactor;
    }

    function enter(uint256 deckId) public {
        require(msg.sender == PepemonCardDeck(_deckAddress).ownerOf(deckId), "PepemonMatchmaker: Not your deck");
        // If playerRanking is empty, set default ranking
        if (playerRanking[msg.sender] == 0) {
            playerRanking[msg.sender] = _defaultRanking;
        }
        // Try find matchmaking partner, if one is found then start the battle, otherwise put in a wait list
        (uint256 opponentDeckId, bool found) = findMatchmakingOpponent(deckId);
        if (found) {
            console.logString("shouldnt happen");
            processMatch(deckId, opponentDeckId);
        } else {
            // transfer deck to contract
            deckOwner[deckId] = msg.sender;
            PepemonCardDeck(_deckAddress).safeTransferFrom(msg.sender, address(this), deckId, "");
            _waitingDecksIndex[deckId] = uint16(waitingDecks.length);
            waitingDecks.push(waitingDeckData(deckId, block.timestamp));
        }
    }

    function exit(uint256 deckId) public {
        require(msg.sender == deckOwner[deckId], "PepemonMatchmaker: Not your deck");

        // Transfer deck back to owner
        PepemonCardDeck(_deckAddress).safeTransferFrom(address(this), deckOwner[deckId], deckId, "");

        // Delete from deckOwner
        delete deckOwner[deckId];

        // Delete from waitingDecks
        waitingDecks[_waitingDecksIndex[deckId]] = waitingDecks[waitingDecks.length - 1];
        waitingDecks.pop();
        delete _waitingDecksIndex[deckId];
    }

    function getEloRatingChange(uint256 winnerRating, uint256 loserRating) public view returns (uint256) {
        (uint256 change,) = Elo.ratingChange(winnerRating, loserRating, 100, _kFactor);
        return change;
    }

    function getWaitingCount() public view returns (uint256) {
        return waitingDecks.length;
    }

    // INTERNALS

    function processMatch(uint256 player1deckId, uint256 player2deckId) internal {
        // Evaluate the battle winner
        (address winner, address loser, uint256 battleId) = doBattle(player1deckId, player2deckId);

        // Give the winner a reward
        sendReward(battleId, winner);

        // Declare winner and loser
        emit BattleFinished(winner, loser, battleId);

        // Adjust ranking accordingly
        uint16 change = uint16(getEloRatingChange(playerRanking[winner], playerRanking[loser]));
        playerRanking[winner] += change;
        // Prevent underflow or rank reset if it gets below or equal to zero
        playerRanking[loser] = int16(playerRanking[loser]) - int16(change) > 0 ? playerRanking[loser]-change : 1;
    }

    function findMatchmakingOpponent(uint256 deckId) internal view returns (uint256, bool) {
        // Find a waiting deck with a ranking that is within matchRange
        console.logString("findMatchmakingOpponent: begin");
        for (uint256 i = 0; i < waitingDecks.length; ++i) {
            // skip own deck, as well as other decks of the same owner
            if (i == deckId || deckOwner[deckId] == deckOwner[i]) {
                continue;
            }
            // increase precision to allow increasing playerMatchRange every second
            uint256 mins = (120 * (block.timestamp - waitingDecks[_waitingDecksIndex[i]].enterTimestamp)) / 60;
            uint256 playerMatchRange = _matchRange + (mins * _matchRangePerMinute) / 120;
            if (
                playerRanking[deckOwner[deckId]] > (playerRanking[deckOwner[i]] - playerMatchRange) &&
                playerRanking[deckOwner[deckId]] < (playerRanking[deckOwner[i]] + playerMatchRange)
            ) {
                console.logString("findMatchmakingOpponent: found one opponent");
                return (waitingDecks[i].deckId, true);
            }
        }
        console.logString("findMatchmakingOpponent: no opponent");
        return (0, false);
    }

    function sendReward(uint256 battleRngSeed, address winner) internal {
        (address rewardTokenAddress, uint256 rewardTokenId) = RewardPool(_rewardPoolAddress).getNextReward(
            battleRngSeed
        );
        ERC1155(rewardTokenAddress).safeTransferFrom(_rewardPoolAddress, winner, rewardTokenId, 1, "");
    }

    function doBattle(uint256 player1deckId, uint256 player2deckId) internal returns (address, address, uint256) {
        require(player1deckId != player2deckId, "PepemonMatchmaker: Cannot battle using the same decks");

        (PepemonBattle.Battle memory battle, uint256 battleId) = PepemonBattle(_battleAddress).createBattle(
            deckOwner[player1deckId],
            player1deckId,
            deckOwner[player2deckId],
            player2deckId
        );

        (, address winner) = PepemonBattle(_battleAddress).goForBattle(battle);

        address loser = (winner == deckOwner[player1deckId] ? deckOwner[player1deckId] : deckOwner[player2deckId]);

        return (winner, loser, battleId);
    }
}
