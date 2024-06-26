// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

/**
This contract acts as the oracle, it contains battling information for both the Pepemon Battle and Support cards
**/
interface IPepemonCardOracle {

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
        uint16 hp; // hitpoints
        uint16 spd; // speed
        uint16 inte; // intelligence
        uint16 def; // defense
        uint16 atk; // attack
        uint16 sAtk; // special attack
        uint16 sDef; // special defense
    }

    struct SupportCardStats {
        uint256 supportCardId;
        SupportCardType supportCardType;
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
        int16 basePower;

        //triggeredPower = power if req met
        int16 triggeredPower;
        EffectTo effectTo;
        EffectFor effectFor;
        uint16 reqCode; //requirement code
    }

    struct EffectMany {
        int16 power;
        uint16 numTurns;
        EffectTo effectTo;
        EffectFor effectFor;
        uint16 reqCode; //requirement code
    }

    //Struct for keeping track of weakness / resistance
    struct elementWR{
        BattleCardTypes weakness;
        BattleCardTypes resistance;
    }

    // mappings
    function battleCardStats(uint256 x) view external returns (BattleCardStats memory);
    
    function supportCardStats(uint256 x) view external returns (SupportCardStats memory);
    
    function elementDecode(BattleCardTypes x) view external returns (string memory);
    
    function weakResist(BattleCardTypes x) view external returns (elementWR memory);

    // other functions
    function addBattleCard(BattleCardStats memory cardData) external;

    function updateBattleCard(BattleCardStats memory cardData) external;

    function getBattleCardById(uint256 _id) view external returns (BattleCardStats memory);

    function addSupportCard(SupportCardStats memory cardData) external;

    function updateSupportCard(SupportCardStats memory cardData) external;

    function getSupportCardById(uint256 _id) view  external returns (SupportCardStats memory);

    function getWeakResist(BattleCardTypes element) view  external returns (elementWR memory);

    function getSupportCardTypeById(uint256 _id) view external returns (SupportCardType);
}
