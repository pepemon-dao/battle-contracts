// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import './lib/AdminRole.sol';

/**
This contract acts as the oracle, it contains battling information for both the Pepemon Battle and Support cards
**/
interface PepemonCardOracle {

    enum SupportCardType {
        OFFENSE,
        STRONG_OFFENSE,
        DEFENSE,
        STRONG_DEFENSE
    }

    enum EffectTo {
        ATTACK,
        STRONG_ATTACK,
        DEFENSE,
        STRONG_DEFENSE,
        SPEED,
        INTELLIGENCE
    }

    enum EffectFor {
        ME,
        ENEMY
    }

    enum BattleCardTypes{
        FIRE,
        GRASS,
        WATER,
        LIGHTNING,
        WIND,
        POISON,
        GHOST,
        FAIRY,
        EARTH,
        UNKNOWN,
        NONE
    }

    struct BattleCardStats {
        uint256 battleCardId;
        BattleCardTypes element;
        string name;
        uint256 hp; // hitpoints
        uint256 spd; // speed
        uint256 inte; // intelligence
        uint256 def; // defense
        uint256 atk; // attack
        uint256 sAtk; // special attack
        uint256 sDef; // special defense
    }

    struct SupportCardStats {
        uint256 supportCardId;
        SupportCardType supportCardType;
        string name;
        EffectOne effectOne;
        EffectMany effectMany;
        // If true, duplicate copies of the card in the same turn will have no extra effect.
        bool unstackable;
        // This property is for EffectMany now.
        // If true, assume the card is already in effect
        // then the same card drawn and used within a number of turns does not extend or reset duration of the effect.
        bool unresettable;
    }

    struct EffectOne {
        // If power is 0, it is equal to the total of all normal offense/defense cards in the current turn.
        
        //basePower = power if req not met
        int256 basePower;

        //triggeredPower = power if req met
        int256 triggeredPower;
        EffectTo effectTo;
        EffectFor effectFor;
        uint256 reqCode; //requirement code
    }

    struct EffectMany {
        int256 power;
        uint256 numTurns;
        EffectTo effectTo;
        EffectFor effectFor;
        uint256 reqCode; //requirement code
    }

    //Struct for keeping track of weakness / resistance
    struct elementWR{
        BattleCardTypes weakness;
        BattleCardTypes resistance;
    }

    //mapping(uint256 => BattleCardStats) public battleCardStats;
    function battleCardStats(uint256 id) external view returns (BattleCardStats memory);

    //mapping(uint256 => SupportCardStats) public supportCardStats;
    function supportCardStats(uint256 id) external view returns (SupportCardStats memory);

    //mapping (BattleCardTypes => string) public elementDecode;
    function elementDecode(BattleCardTypes battleCardTypes) external view returns (string memory);

    //mapping (BattleCardTypes => elementWR) public weakResist;
    function weakResist(BattleCardTypes battleCardTypes) external view returns (elementWR memory);

    event BattleCardCreated(address sender, uint256 cardId);
    event BattleCardUpdated(address sender, uint256 cardId);
    event SupportCardCreated(address sender, uint256 cardId);
    event SupportCardUpdated(address sender, uint256 cardId);

    function addBattleCard(BattleCardStats memory cardData) external;

    function updateBattleCard(BattleCardStats memory cardData) external;

    function getBattleCardById(uint256 _id) external view returns (BattleCardStats memory);

    function addSupportCard(SupportCardStats memory cardData) external;

    function updateSupportCard(SupportCardStats memory cardData) external;

    function getSupportCardById(uint256 _id) external view returns (SupportCardStats memory);

    function getWeakResist(BattleCardTypes element) external view returns (elementWR memory);

    /**
     * @dev Get supportCardType of supportCard
     * @param _id uint256
     */
    function getSupportCardTypeById(uint256 _id) external view returns (SupportCardType);
}
