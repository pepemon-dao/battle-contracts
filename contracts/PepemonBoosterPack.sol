// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./lib/AdminRole.sol";

interface IPepemonCardFaucet {
    function mintCards() external;
}

/**
 * @title PepemonBoosterPack
 * @dev Paid booster packs that mint onto the game's existing card factory.
 *
 * This is deliberately a standalone contract rather than a change to PepemonCardDeck.
 * PepemonCardDeck is not upgradeable, so adding pack minting there would mean redeploying it
 * and orphaning every deck NFT already issued, plus the matchmaker's references to them.
 *
 * PepemonCardDeck.mintInitialDeck already looks like a booster pack, but it cannot be reused:
 * on the live deployment its battle card allowlist is empty, its randomness oracle address is
 * zero, and the factory's batchMintList reverts on every call because it iterates i <= length.
 * All three were confirmed against Base Sepolia before this contract was written.
 *
 * Cards are sourced through PepemonCardDeck.mintCards(), which is permissionless and mints one
 * of every card id to its caller. That means this contract needs no minter role and no admin
 * transaction on any existing contract to go live. The trade-off is a hard dependency on that
 * faucet staying enabled: if an admin ever calls setMintingCards(_, 0), packs stop working and
 * this contract has to be redeployed against a minter role instead. It holds no player state,
 * so that redeploy is cheap.
 */
contract PepemonBoosterPack is ERC1155Holder, AdminRole {
    struct Tier {
        uint128 price;
        uint8 battleCards;
        uint8 commonCards;
        uint8 rareCards;
        uint8 epicCards;
        bool enabled;
    }

    /// @dev The game's card factory. Packs mint here so decks and battles work unchanged.
    IERC1155 public immutable factory;

    /// @dev PepemonCardDeck, used only for its permissionless mintCards() faucet.
    IPepemonCardFaucet public immutable cardSource;

    mapping(uint8 => Tier) public tiers;

    uint256[] public battlePool;
    uint256[] public commonPool;
    uint256[] public rarePool;
    uint256[] public epicPool;

    uint256 private nonce;

    event PackOpened(address indexed buyer, uint8 indexed tier, uint256[] cardIds);
    event TierUpdated(uint8 indexed tier, uint128 price, bool enabled);
    event PoolsUpdated(uint256 battleCount, uint256 commonCount, uint256 rareCount, uint256 epicCount);
    event Withdrawn(address indexed to, uint256 amount);

    constructor(address factoryAddress, address cardSourceAddress) {
        require(factoryAddress != address(0), "PepemonBoosterPack: No factory");
        require(cardSourceAddress != address(0), "PepemonBoosterPack: No card source");
        factory = IERC1155(factoryAddress);
        cardSource = IPepemonCardFaucet(cardSourceAddress);
    }

    // ---------------------------------------------------------------- purchase

    /**
     * @dev Buys and immediately opens one pack, transferring the cards to the caller.
     */
    function mintPack(uint8 tierId) external payable {
        // A pack is rolled and revealed inside a single transaction, so a contract caller could
        // inspect what it drew and revert on a bad roll, paying only gas until it hits an Epic.
        // Rejecting contract callers removes that option; there is no cheap reroll for an EOA
        // because the seed moves with every block.
        require(msg.sender == tx.origin, "PepemonBoosterPack: EOA only");

        Tier memory tier = tiers[tierId];
        require(tier.enabled, "PepemonBoosterPack: Unknown tier");
        require(msg.value == tier.price, "PepemonBoosterPack: Incorrect price");

        uint256[] memory cards = _roll(tier, _seed());

        _topUpInventory();

        for (uint256 i = 0; i < cards.length; ++i) {
            factory.safeTransferFrom(address(this), msg.sender, cards[i], 1, "");
        }

        emit PackOpened(msg.sender, tierId, cards);
    }

    // ---------------------------------------------------------------- views

    function packSize(uint8 tierId) public view returns (uint256) {
        Tier memory tier = tiers[tierId];
        return uint256(tier.battleCards) + tier.commonCards + tier.rareCards + tier.epicCards;
    }

    /**
     * @dev Single-value accessors for the game client.
     *
     * The public `tiers` mapping already returns all of this, but as a tuple. Decoding a tuple
     * in the Unity client needs a Nethereum DTO plus a separate WebGL code path, and WebGL is
     * the one target that cannot be tested outside a 35-minute cloud build. Reading two plain
     * uint256 values instead removes that whole class of failure for three lines of Solidity.
     */
    function tierPrice(uint8 tierId) external view returns (uint256) {
        return tiers[tierId].price;
    }

    function tierEnabled(uint8 tierId) external view returns (bool) {
        return tiers[tierId].enabled;
    }

    function getPools()
        external
        view
        returns (
            uint256[] memory battle,
            uint256[] memory common,
            uint256[] memory rare,
            uint256[] memory epic
        )
    {
        return (battlePool, commonPool, rarePool, epicPool);
    }

    // ---------------------------------------------------------------- admin

    function setTier(
        uint8 tierId,
        uint128 price,
        uint8 battleCards,
        uint8 commonCards,
        uint8 rareCards,
        uint8 epicCards,
        bool enabled
    ) external onlyAdmin {
        require(battlePool.length >= battleCards, "PepemonBoosterPack: Battle pool too small");
        require(commonPool.length >= commonCards, "PepemonBoosterPack: Common pool too small");
        require(rarePool.length >= rareCards, "PepemonBoosterPack: Rare pool too small");
        require(epicPool.length >= epicCards, "PepemonBoosterPack: Epic pool too small");

        tiers[tierId] = Tier(price, battleCards, commonCards, rareCards, epicCards, enabled);
        emit TierUpdated(tierId, price, enabled);
    }

    function setPools(
        uint256[] calldata battle,
        uint256[] calldata common,
        uint256[] calldata rare,
        uint256[] calldata epic
    ) external onlyAdmin {
        battlePool = battle;
        commonPool = common;
        rarePool = rare;
        epicPool = epic;
        emit PoolsUpdated(battle.length, common.length, rare.length, epic.length);
    }

    function withdraw(address payable to) external onlyAdmin {
        require(to != address(0), "PepemonBoosterPack: No recipient");
        uint256 amount = address(this).balance;
        (bool sent, ) = to.call{value: amount}("");
        require(sent, "PepemonBoosterPack: Withdraw failed");
        emit Withdrawn(to, amount);
    }

    // ---------------------------------------------------------------- internals

    function _seed() private returns (uint256) {
        // block.difficulty compiles to opcode 0x44, which on OP-stack chains such as Base
        // carries the prevrandao value posted from L1. Solidity 0.8.6 predates the prevrandao
        // alias, so the old name is used for the same opcode.
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(blockhash(block.number - 1), block.timestamp, block.difficulty, msg.sender, nonce)
            )
        );
        nonce++;
        return seed;
    }

    function _roll(Tier memory tier, uint256 seed) private view returns (uint256[] memory) {
        uint256 total = uint256(tier.battleCards) + tier.commonCards + tier.rareCards + tier.epicCards;
        require(total > 0, "PepemonBoosterPack: Empty pack");

        uint256[] memory cards = new uint256[](total);
        uint256 written = 0;

        written = _draw(battlePool, tier.battleCards, seed, 0, cards, written);
        written = _draw(commonPool, tier.commonCards, seed, 1, cards, written);
        written = _draw(rarePool, tier.rareCards, seed, 2, cards, written);
        _draw(epicPool, tier.epicCards, seed, 3, cards, written);

        return cards;
    }

    /**
     * @dev Draws `count` distinct ids from `pool` by partial Fisher-Yates over a memory copy.
     *
     * Distinctness is what lets _ensureInventory get away with a single faucet top-up: every
     * card in a pack is needed exactly once, and one mintCards() call adds one of every id.
     */
    function _draw(
        uint256[] storage pool,
        uint256 count,
        uint256 seed,
        uint256 salt,
        uint256[] memory out,
        uint256 offset
    ) private view returns (uint256) {
        if (count == 0) {
            return offset;
        }

        uint256 poolSize = pool.length;
        require(poolSize >= count, "PepemonBoosterPack: Pool too small");

        uint256[] memory bag = new uint256[](poolSize);
        for (uint256 i = 0; i < poolSize; ++i) {
            bag[i] = pool[i];
        }

        for (uint256 i = 0; i < count; ++i) {
            uint256 pick = i + (uint256(keccak256(abi.encodePacked(seed, salt, i))) % (poolSize - i));
            (bag[i], bag[pick]) = (bag[pick], bag[i]);
            out[offset + i] = bag[i];
        }

        return offset + count;
    }

    /**
     * @dev Tops up inventory from the faucet, unconditionally.
     *
     * mintCards() mints one of every card id to this contract, and packs draw distinct cards
     * from disjoint pools, so one call always covers a whole pack.
     *
     * Topping up only when a drawn card happened to be missing would usually be cheaper, but it
     * put a ~1.7M gas swing on the outcome of the roll. Because the seed moves between a
     * wallet's gas estimation and execution, a pack estimated against a cheap roll could execute
     * an expensive one and run out of gas, taking the player's money and giving nothing back.
     *
     * Doing it every time does not make gas constant -- measured cost still moves by roughly
     * 100-400k depending on which storage slots are already warm -- but it removes the large
     * swing and leaves a residue that a normal estimation buffer covers. Callers should still
     * send with headroom rather than a bare estimate; see PepemonBoosterPack.cs in the client.
     */
    function _topUpInventory() private {
        cardSource.mintCards();
    }
}
