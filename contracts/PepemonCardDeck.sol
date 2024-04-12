// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
//pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./iface/IPepemonFactory.sol";
import "./iface/IPepemonCardOracle.sol";
import "./lib/AdminRole.sol";
import "./lib/Arrays.sol";
import "./lib/PepemonConfig.sol";

contract PepemonCardDeck is ERC721, ERC1155Holder, AdminRole, IConfigurable {
    using SafeMath for uint256;

    struct Deck {
        uint256 battleCardId;
        uint256 supportCardCount;
        mapping(uint256 => SupportCardType) supportCardTypes;
        uint256[] supportCardTypeList;
    }

    struct SupportCardType {
        uint256 supportCardId;
        uint256 count;
        uint256 pointer;
        bool isEntity;
    }

    struct SupportCardRequest {
        uint256 supportCardId;
        uint256 amount;
    }

    uint256 public MAX_SUPPORT_CARDS;
    uint256 public MIN_SUPPORT_CARDS;

    // set this to 0 to disable minting test cards.
    uint256 maxMintTestCardId;
    uint256 minMintTestCardId;

    uint256 nextDeckId;
    address public configAddress;
    address public factoryAddress;

    mapping(uint256 => Deck) public decks;
    mapping(address => uint256[]) public playerToDecks;

    constructor(address _configAddress) ERC721("Pepedeck", "Pepedeck") {
        nextDeckId = 1;
        MAX_SUPPORT_CARDS = 60;
        MIN_SUPPORT_CARDS = 40;
        
        minMintTestCardId = 1;
        configAddress = _configAddress;
    }

    /**
     * @dev Override supportInterface .
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC1155Receiver)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // MODIFIERS
    modifier sendersDeck(uint256 _deckId) {
        require(msg.sender == ownerOf(_deckId), "PepemonCardDeck: Not your deck");
        _;
    }



    // PUBLIC METHODS
    function setConfigAddress(address _configAddress) external onlyAdmin {
        configAddress = _configAddress;
    }

    function syncConfig() external override onlyAdmin {
        factoryAddress = PepemonConfig(configAddress).contractAddresses("PepemonFactory");
    }

    function setMaxSupportCards(uint256 _maxSupportCards) public onlyAdmin {
        MAX_SUPPORT_CARDS = _maxSupportCards;
    }

    function setMinSupportCards(uint256 _minSupportCards) public onlyAdmin {
        MIN_SUPPORT_CARDS = _minSupportCards;
    }

    // ALLOW TEST MINTING
    function setMintingCards(uint256 minCardId, uint256 maxCardId) public onlyAdmin {
        maxMintTestCardId = maxCardId;
        minMintTestCardId = minCardId;
    }
    /**
     * @dev right now there are 40 different cards that can be minted, but the maximum is configurable with maxMintTestCard. 
     * setting maxMintTestCard to 0 disables this card minting.
     */
    function mintCards() public {
        require(maxMintTestCardId > 0, "Minting test cards is disabled");
        IPepemonFactory(factoryAddress).batchMint(minMintTestCardId, maxMintTestCardId, msg.sender);
    }

    function createDeck() public {
        _safeMint(msg.sender, nextDeckId);
        playerToDecks[msg.sender].push(nextDeckId);
        nextDeckId = nextDeckId.add(1);
    }

    function addBattleCardToDeck(uint256 deckId, uint256 battleCardId) public sendersDeck(deckId) {
        require(
            IPepemonFactory(factoryAddress).balanceOf(msg.sender, battleCardId) >= 1,
            "PepemonCardDeck: Don't own battle card"
        );

        require(battleCardId != decks[deckId].battleCardId, "PepemonCardDeck: Card already in deck");

        uint256 oldBattleCardId = decks[deckId].battleCardId;
        decks[deckId].battleCardId = battleCardId;

        IPepemonFactory(factoryAddress).safeTransferFrom(msg.sender, address(this), battleCardId, 1, "");

        returnBattleCardFromDeck(oldBattleCardId);
    }

    function removeBattleCardFromDeck(uint256 _deckId) public sendersDeck(_deckId) {
        uint256 oldBattleCardId = decks[_deckId].battleCardId;

        decks[_deckId].battleCardId = 0;

        returnBattleCardFromDeck(oldBattleCardId);
    }

    function addSupportCardsToDeck(uint256 deckId, SupportCardRequest[] memory supportCards) public sendersDeck(deckId) {
        for (uint256 i = 0; i < supportCards.length; i++) {
            addSupportCardToDeck(deckId, supportCards[i].supportCardId, supportCards[i].amount);
        }
    }

    function removeSupportCardsFromDeck(uint256 _deckId, SupportCardRequest[] memory _supportCards) public sendersDeck(_deckId) {
        for (uint256 i = 0; i < _supportCards.length; i++) {
            removeSupportCardFromDeck(_deckId, _supportCards[i].supportCardId, _supportCards[i].amount);
        }
    }

    // INTERNALS
    function addSupportCardToDeck(
        uint256 _deckId,
        uint256 _supportCardId,
        uint256 _amount
    ) internal {
        require(MAX_SUPPORT_CARDS >= decks[_deckId].supportCardCount.add(_amount), "PepemonCardDeck: Deck overflow");
        require(
            IPepemonFactory(factoryAddress).balanceOf(msg.sender, _supportCardId) >= _amount,
            "PepemonCardDeck: You don't have enough of this card"
        );

        if (!decks[_deckId].supportCardTypes[_supportCardId].isEntity) {
            decks[_deckId].supportCardTypes[_supportCardId] = SupportCardType({
                supportCardId: _supportCardId,
                count: _amount,
                pointer: decks[_deckId].supportCardTypeList.length,
                isEntity: true
            });

            // Prepend the ID to the list
            decks[_deckId].supportCardTypeList.push(_supportCardId);
        } else {
            SupportCardType storage supportCard = decks[_deckId].supportCardTypes[_supportCardId];
            supportCard.count = supportCard.count.add(_amount);
        }

        decks[_deckId].supportCardCount = decks[_deckId].supportCardCount.add(_amount);

        IPepemonFactory(factoryAddress).safeTransferFrom(msg.sender, address(this), _supportCardId, _amount, "");
    }

    function removeSupportCardFromDeck(
        uint256 _deckId,
        uint256 _supportCardId,
        uint256 _amount
    ) internal {
        SupportCardType storage supportCardList = decks[_deckId].supportCardTypes[_supportCardId];
        supportCardList.count = supportCardList.count.sub(_amount);

        decks[_deckId].supportCardCount = decks[_deckId].supportCardCount.sub(_amount);

        if (supportCardList.count == 0) {
            uint256 lastItemIndex = decks[_deckId].supportCardTypeList.length - 1;

            // update the pointer of the item to be swapped
            uint256 lastSupportCardId = decks[_deckId].supportCardTypeList[lastItemIndex];
            decks[_deckId].supportCardTypes[lastSupportCardId].pointer = supportCardList.pointer;

            // swap the last item of the list with the one to be deleted
            decks[_deckId].supportCardTypeList[supportCardList.pointer] = decks[_deckId].supportCardTypeList[lastItemIndex];
            decks[_deckId].supportCardTypeList.pop();

            delete decks[_deckId].supportCardTypes[_supportCardId];
        }

        IPepemonFactory(factoryAddress).safeTransferFrom(address(this), msg.sender, _supportCardId, _amount, "");
    }

    function returnBattleCardFromDeck(uint256 _battleCardId) internal {
        if (_battleCardId != 0) {
            IPepemonFactory(factoryAddress).safeTransferFrom(address(this), msg.sender, _battleCardId, 1, "");
        }
    }

    // VIEWS
    function getDeckCount(address player) public view returns (uint256) {
        return playerToDecks[player].length;
    }

    function getBattleCardInDeck(uint256 _deckId) public view returns (uint256) {
        return decks[_deckId].battleCardId;
    }

    function getCardTypesInDeck(uint256 _deckId) public view returns (uint256[] memory) {
        Deck storage deck = decks[_deckId];

        uint256[] memory supportCardTypes = new uint256[](deck.supportCardTypeList.length);

        for (uint256 i = 0; i < deck.supportCardTypeList.length; i++) {
            supportCardTypes[i] = deck.supportCardTypeList[i];
        }

        return supportCardTypes;
    }

    function getCountOfCardTypeInDeck(uint256 _deckId, uint256 _cardTypeId) public view returns (uint256) {
        return decks[_deckId].supportCardTypes[_cardTypeId].count;
    }

    function getSupportCardCountInDeck(uint256 deckId) public view returns (uint256) {
        return decks[deckId].supportCardCount;
    }

    /**
     * @dev Returns array of support cards for a deck
     * @param _deckId uint256 ID of the deck
     */
    function getAllSupportCardsInDeck(uint256 _deckId) public view returns (uint256[] memory) {
        Deck storage deck = decks[_deckId];
        uint256[] memory supportCards = new uint256[](deck.supportCardCount);
        uint256 idx = 0;
        for (uint256 i = 0; i < deck.supportCardTypeList.length; i++) {
            uint256 supportCardId = deck.supportCardTypeList[i];
            uint256 count = deck.supportCardTypes[supportCardId].count;
            for (uint256 j = 0; j < count; j++) {
                supportCards[idx++] = supportCardId;
            }
        }
        return supportCards;
    }

    /**
     * @dev Shuffles deck
     * @param _deckId uint256 ID of the deck
     */
    function shuffleDeck(uint256 _deckId, uint256 _seed) public view returns (uint256[] memory) {
        uint256[] memory totalSupportCards = getAllSupportCardsInDeck(_deckId);
        return Arrays.shuffle(totalSupportCards, _seed);
    }
}
