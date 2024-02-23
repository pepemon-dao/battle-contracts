import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

export enum SupportCardType {
    OFFENSE,
    STRONG_OFFENSE,
    DEFENSE,
    STRONG_DEFENSE
}

export enum EffectFor {
    ME,
    ENEMY
}

export enum EffectTo {
    ATTACK,
    STRONG_ATTACK,
    DEFENSE,
    STRONG_DEFENSE,
    SPEED,
    INTELLIGENCE
}

export enum factoryBattlecardStats {
    element,
    hp,
    speed,
    intelligence,
    defense,
    attack,
    specialAttack,
    specialDefense,
    level,
    description,
    ipfsAddr,
    rarity,
}

export enum factorySupportcardStats {
    currentRoundChanges,
    nextRoundChanges,
    specialCode,
    modifierNumberOfNextTurns,
    isOffense,
    isNormal,
    isStackable,
    name,
    description,
    ipfsAddr,
    rarity,
}

export const BATTLECARDS = [
    [
        /*element       */ 1,
        /*hp            */ 40,
        /*speed         */ 5,
        /*intelligence  */ 4,
        /*defense       */ 12,
        /*attack        */ 5,
        /*specialAttack */ 20,
        /*specialDefense*/ 12,
        /*level         */ 1,
        /*name          */ 'Fafny',
        /*description   */ 'Fafny (Battle ver.)',
        /*ipfsAddr      */ 'https://bafybeic6bdnthjp4v54srm7rolztddjh4sogqj3ucuzyuakrutsjv67omm.ipfs.dweb.link/bfafnycard.png',
        /*rarity        */ 'Common'
    ],
    [
        /*element       */ 4,
        /*hp            */ 45,
        /*speed         */ 14,
        /*intelligence  */ 4,
        /*defense       */ 16,
        /*attack        */ 5,
        /*specialAttack */ 10,
        /*specialDefense*/ 5,
        /*level         */ 1,
        /*name          */ 'Druky',
        /*description   */ 'Druky (Battle ver.)',
        /*ipfsAddr      */ 'https://bafybeic6bdnthjp4v54srm7rolztddjh4sogqj3ucuzyuakrutsjv67omm.ipfs.dweb.link/bdrukycard.png',
        /*rarity        */ 'Common'
    ],
    [
        /*element       */ 5,
        /*hp            */ 35,
        /*speed         */ 20,
        /*intelligence  */ 4,
        /*defense       */ 10,
        /*attack        */ 5,
        /*specialAttack */ 15,
        /*specialDefense*/ 10,
        /*level         */ 1,
        /*name          */ 'Sairy',
        /*description   */ 'Sairy (Battle ver.)',
        /*ipfsAddr      */ 'https://bafybeic6bdnthjp4v54srm7rolztddjh4sogqj3ucuzyuakrutsjv67omm.ipfs.dweb.link/bsairycard.png',
        /*rarity        */ 'Common'
    ],
    [
        /*element       */ 6,
        /*hp            */ 40,
        /*speed         */ 5,
        /*intelligence  */ 4,
        /*defense       */ 20,
        /*attack        */ 5,
        /*specialAttack */ 20,
        /*specialDefense*/ 5,
        /*level         */ 1,
        /*name          */ 'Venumu',
        /*description   */ 'Venumu (Battle ver.)',
        /*ipfsAddr      */ 'https://bafybeic6bdnthjp4v54srm7rolztddjh4sogqj3ucuzyuakrutsjv67omm.ipfs.dweb.link/bvenumucard.png',
        /*rarity        */ 'Common'
    ],
    [
        /*element       */ 9,
        /*hp            */ 40,
        /*speed         */ 5,
        /*intelligence  */ 4,
        /*defense       */ 17,
        /*attack        */ 25,
        /*specialAttack */ 2,
        /*specialDefense*/ 5,
        /*level         */ 1,
        /*name          */ 'Shapu',
        /*description   */ 'Shapu (Battle ver.)',
        /*ipfsAddr      */ 'https://bafybeic6bdnthjp4v54srm7rolztddjh4sogqj3ucuzyuakrutsjv67omm.ipfs.dweb.link/bshapucard.png',
        /*rarity        */ 'Common'
    ],
    [
        /*element       */ 4,
        /*hp            */ 40,
        /*speed         */ 13,
        /*intelligence  */ 4,
        /*defense       */ 10,
        /*attack        */ 4,
        /*specialAttack */ 17,
        /*specialDefense*/ 10,
        /*level         */ 1,
        /*name          */ 'Kirimu',
        /*description   */ 'Kirimu (Battle ver.)',
        /*ipfsAddr      */ 'https://bafybeic6bdnthjp4v54srm7rolztddjh4sogqj3ucuzyuakrutsjv67omm.ipfs.dweb.link/bkirimucard.png',
        /*rarity        */ 'Common'
    ],
    [
        /*element       */ 2,
        /*hp            */ 39,
        /*speed         */ 11,
        /*intelligence  */ 4,
        /*defense       */ 3,
        /*attack        */ 1,
        /*specialAttack */ 22,
        /*specialDefense*/ 19,
        /*level         */ 1,
        /*name          */ 'Mandraky',
        /*description   */ 'Mandraky (Battle ver.)',
        /*ipfsAddr      */ 'https://bafybeic6bdnthjp4v54srm7rolztddjh4sogqj3ucuzyuakrutsjv67omm.ipfs.dweb.link/bmandrakycard.png',
        /*rarity        */ 'Common'
    ],
    [
        /*element       */ 10,
        /*hp            */ 30,
        /*speed         */ 21,
        /*intelligence  */ 4,
        /*defense       */ 13,
        /*attack        */ 4,
        /*specialAttack */ 20,
        /*specialDefense*/ 15,
        /*level         */ 1,
        /*name          */ 'Cosmony',
        /*description   */ 'Cosmony (Battle ver.)',
        /*ipfsAddr      */ 'https://bafybeic6bdnthjp4v54srm7rolztddjh4sogqj3ucuzyuakrutsjv67omm.ipfs.dweb.link/bcosmonycard.png',
        /*rarity        */ 'Common'
    ],
    [
        /*element       */ 7,
        /*hp            */ 29,
        /*speed         */ 14,
        /*intelligence  */ 4,
        /*defense       */ 10,
        /*attack        */ 11,
        /*specialAttack */ 18,
        /*specialDefense*/ 11,
        /*level         */ 1,
        /*name          */ 'Witchenry',
        /*description   */ 'Witchenry (Battle ver.)',
        /*ipfsAddr      */ 'https://bafybeic6bdnthjp4v54srm7rolztddjh4sogqj3ucuzyuakrutsjv67omm.ipfs.dweb.link/bwitchenrycard.png',
        /*rarity        */ 'Common'
    ],
    [
        /*element       */ 8,
        /*hp            */ 32,
        /*speed         */ 18,
        /*intelligence  */ 4,
        /*defense       */ 15,
        /*attack        */ 5,
        /*specialAttack */ 10,
        /*specialDefense*/ 15,
        /*level         */ 1,
        /*name          */ 'Unifairy',
        /*description   */ 'Unifairy (Battle ver.)',
        /*ipfsAddr      */ 'https://bafybeic6bdnthjp4v54srm7rolztddjh4sogqj3ucuzyuakrutsjv67omm.ipfs.dweb.link/bunifairycard.png',
        /*rarity        */ 'Common'
    ]
]

export const SUPPORTCARDS = [
    [
        /*currentRoundChanges*/  '0x0000000000000000000000000000000000000000000000020000000000000000',
        /*nextRoundChanges   */  '0x0000000000000000000000000000000000000000000000000000000000000000',
        /*specialCode        */  '0x00',
        /*modifierNumberOfNextTurns*/  1,
        /*isOffense          */  true,
        /*isNormal           */  true,
        /*isStackable        */  false,
        /*name               */  'Pretty Quick Attack',
        /*description        */  'Pepemon adds +2 to its Attack Power until end of turn',
        /*ipfsAddr           */  'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Pretty%20Quick%20Attack.png',
        /*rarity             */  'Common'
    ],
    [
        '0x0000000000000000000000000000000000000000000000020000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x00',
        1,
        true,
        true,
        false,
        'Pretty Quick Attack',
        "Pepemon adds +2 to its Attack Power until end of turn",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Pretty%20Quick%20Attack.png',
        'Common'
    ],
    [
        '0x0000000000000000000000000000000000000000000000030000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x00',
        1,
        true,
        true,
        false,
        'Quick attack',
        "Pepemon adds +3 to its Attack Power until end of turn",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Quick%20Attack.png',
        'Common'
    ],
    [
        '0x0000000000000000000000000000000000000000000000040000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x00',
        1,
        true,
        true,
        false,
        'Double Quick Attack',
        "Pepemon adds +4 to its Attack Power until end of turn",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Double%20Quick%20Attack.png',
        'Common'
    ],
    [
        '0x0000000000000000000000000000000000000000000000020000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x00',
        1,
        true,
        true,
        false,
        'Pretty Quick Attack',
        "Pepemon adds +2 to its Attack Power until end of turn",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Pretty%20Quick%20Attack.png',
        'Common'
    ],
    [
        '0x0000000000000000000000000000000000000000000000030000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x00',
        1,
        true,
        true,
        false,
        'Quick attack',
        "Pepemon adds +3 to its Attack Power until end of turn",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Quick%20Attack.png',
        'Common'
    ],
    [
        '0x0000000000000000000000000000000000000000000000040000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x00',
        1,
        true,
        true,
        false,
        'Double Quick Attack',
        "Pepemon adds +4 to its Attack Power until end of turn",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Double%20Quick%20Attack.png',
        'Common'
    ],
    [
        '0x0000000000000000000000000000000000000000000003ee0000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x01',
        1,
        true,
        true,
        false,
        "Don't think too much & strike!",
        "Pepemon adds +1 to its Attack Power until end of turn. If the Pepemon's Intelligence is 5 or less, add an additional +5 more to its Attack Power until end of turn",
        "https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Don_t%20Think%20Too%20Much%20_%20Strike%21.png",
        'Rare'
    ],
    [
        '0x0000000000000000000000000000000000000000000003f00000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x02',
        1,
        true,
        true,
        false,
        'Found an opening!',
        "Pepemon adds +1 to its Attack Power until end of turn. If the player of the defending Pepemon does not lay any Defense cards, Pepemon adds an additional +7 to its Attack Power until end of turn.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Found%20an%20Opening%21.png',
        'Rare'
    ],
    [
        '0x0000000000000000000000000000000000000000000000070000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x03',
        1,
        true,
        false,
        false,
        'Super Fang',
        "Pepemon adds +7 to its Attack Power until end of turn for each +2 offense card used by its player during this turn",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Super%20Fang.png',
        'Rare'
    ],
    [
        '0x0000000000000000000000000000000000000000000000060000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x04',
        1,
        true,
        false,
        false,
        'Hyper Fang',
        "Pepemon adds +6 to its Attack Power until end of turn for each +3 offense card used during this turn",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Hyper%20Fang.png',
        'Rare'
    ],
    [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x05',
        1,
        true,
        false,
        false,
        'Ultimate Power',
        "Pepemon uses its Special Attack instead of its Normal Attack during this turn (no bonuses for using two copies of the same card in the same turn)",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Ultimate%20Power.png',
        'Rare'
    ],
    [
        '0x0000000000000000000000000000000000000000000000040000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x06',
        1,
        true,
        false,
        false,
        'Invested Power',
        "Pepemon adds +4 to its Attack Power until end of turn for each offense card used by its player during this turn",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Invested%20Power.png',
        'Epic'
    ],
    [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x07',
        1,
        true,
        false,
        false,
        'Think less, strike harder!',
        "If the Pepemon's Intelligence is 5 or less, then until end of turn, the Pepemon receives an additional Attack Power equal to the total of all the offense cards used by its player this turn (excluding offense card bonuses).",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Think%20Less,%20Strike%20Harder%21.png',
        'Epic'
    ],
    [
        '0x0000000000000000000000000000000000000000000000000000000000050000',
        '0x0000000000000000000000000000000000000000000000000000000000050000',
        '0x00',
        3,
        true,
        false,
        true,
        'Extreme Speed',
        "Pepemon adds +5 Speed for the next 3 turns. (Unstackable 3, Unresettable 3) Effects do not stack or reset with another card of the same name.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Extreme%20Speed.png',
        'Rare'
    ],
    [
        '0x0000000000000000000000000000000000000000000000020000000000000000',
        '0x0000000000000000000000000000000000000000000000020000000000000000',
        '0x00',
        4,
        true,
        false,
        true,
        'Think now, strike later.',
        "Pepemon adds an +2 Attack Power effect for this turn and the next 3 turns. (Unstackable 3, Unresettable 3) Effects do not stack or reset with another card of the same name.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Think%20Now,%20Strike%20Later..png',
        'Epic'
    ],
    [
        '0x0000000000000000000000000000000000000000000000000003000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x00',
        1,
        false,
        true,
        false,
        'Block',
        "Pepemon adds +3 to its Defense Power until end of turn",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Block.png',
        'Common'
    ],
    [
        '0x0000000000000000000000000000000000000000000000000004000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x00',
        1,
        false,
        true,
        false,
        'Shield',
        "Pepemon adds +4 to its Defense Power until end of turn",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Shield.png',
        'Common'
    ],
    [
        '0x0000000000000000000000000000000000000000000000000005000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x00',
        1,
        false,
        true,
        false,
        'Block with a rock!',
        "Pepemon adds +5 to its Defense Power until end of turn.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Block%20with%20a%20Rock%21.png',
        'Common'
    ],
    [
        '0x0000000000000000000000000000000000000000000000000006000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x08',
        1,
        false,
        true,
        false,
        'Double Team',
        "Pepemon adds +6 to its Defense Power for each +3 Defense card used by its player during this turn.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Double%20Team.png',
        'Rare'
    ],
    [
        '0x0000000000000000000000000000000000000000000000000005000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x09',
        1,
        false,
        true,
        false,
        'Parry',
        "Pepemon adds +5 to its Defense Power for each +4 Defense card used by the player during this turn",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Parry.png',
        'Rare'
    ],
    [
        '0x00000000000000000000000000000000000000000000000007d9000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x01',
        1,
        false,
        false,
        false,
        'Degen Defense',
        "Pepemon adds +2 to its Defense Power until end of turn. If the Pepemon has 5 Intelligence or lower, the Pepemon adds an additional +7 Defense Power until end of turn.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Degen%20Defense.png',
        'Rare'
    ],
    [
        '0x00000000000000000000000000000000000000000000000007d7000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0a',
        1,
        false,
        false,
        false,
        'Think and observe.',
        "Pepemon adds +2 to its Defense Power until end of turn. If the Pepemon's Intelligence is 7 or more, add an additional +5 Defense Power to the Pepemon until end of turn.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Think%20and%20Observe.png',
        'Rare'
    ],
    [
        '0x00000000000000000000000000000000000000000000000007dc000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0b',
        1,
        false,
        false,
        false,
        'I read you like a book!',
        "Pepemon adds +2 to its Defense Power until end of turn. Pepemon adds an additional +10 to its Defense Power until end of turn, if the attacking Pepemon used its strong attack this turn.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/I%20Read%20You%20Like%20a%20Book%21.png',
        'Rare'
    ],
    [
        '0x0000000000000000000000000000000000000000000000000000000100000000',
        '0x0000000000000000000000000000000000000000000000000000000100000000',
        '0x00',
        2,
        false,
        false,
        true,
        'Due Dilligence',
        "Pepemon adds +1 Intelligence for the next 2 turns. (Unstackable 2, Unresettable 2) Effects do not stack or reset with another card of the same name.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Due%20Dilligence.png',
        'Epic'
    ],
    [
        '0x00000000000000000000fffc0000000000000000000000010000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x00',
        1,
        true,
        true,
        false,
        'Poison Fang',
        "Pepemon gets +1 to its Attack Power until end of turn, while the target defending Pepemon gets -4 to its Defense Power until end of turn.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Poison%20Fang.png',
        'Rare'
    ],
    [
        '0x00000000000000000000fffb0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x00',
        1,
        true,
        true,
        false,
        'Sucker Punch',
        "Opposing Pepemon gets -5 to its Defense Power until end of turn",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Sucker%20Punch.png',
        'Rare'
    ],
    [
        '0x00000000000000000000fffd0000000000000000000000000000000000000000',
        '0x00000000000000000000fffd0000000000000000000000000000000000000000',
        '0x00',
        3,
        true,
        false,
        true,
        'Taunt..*',
        "Target defending Pepemon gets -3 to its Defense Power for this turn and in the next 2 turns. (Unstackable 2, Unresettable 2). Effects do not stack or reset with another card of the same name.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Taunt.png',
        'Epic'
    ],
    [
        '0x000000000000000000000000ffff000000000000000000000000000000000000',
        '0x000000000000000000000000ffff000000000000000000000000000000000000',
        '0x00',
        2,
        true,
        false,
        true,
        'Riddle Me This',
        "Target defending Pepemon gets -1 Intelligence for the next 2 turns. (Unstackable 2, Unresettable 2). Effects do not stack or reset with another card of the same name.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Riddle%20Me%20This.png',
        'Epic'
    ],
    [
        '0x0000000000000000fffc00000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x00',
        1,
        false,
        true,
        false,
        'Water Clone',
        "Target attacking Pepemon gets -4 Attack Power until end of turn.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Water%20Clone.png',
        'Rare'
    ],
    [
        '0x0000000000000000f44100000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x01',
        1,
        false,
        true,
        false,
        'Flame Clone',
        "Target attacking Pepemon gets -3 Attack Power until end of turn. If the attacking Pepemon has 5 or less Intelligence, attacking Pepemon gets a further -4 Attack Power until end of turn.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Flame%20Clone.png',
        'Rare'
    ],
    [
        '0x0000000000000000fffd00000000000000000000000000000000000000000000',
        '0x0000000000000000fffd00000000000000000000000000000000000000000000',
        '0x00',
        3,
        false,
        false,
        true,
        'Mud Slide',
        "Target attacking Pepemon gets -3 to its Attack Power for this turn and the next 2 turns. (Unstackable 2, Unresettable 2). Effects do not stack with another card of the same name.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Mud%20Slide.png',
        'Rare'
    ],
    [
        '0x0000000000000000fffe00000000000000000000000000000000000000000000',
        '0x0000000000000000fffe00000000000000000000000000000000000000000000',
        '0x00',
        4,
        false,
        false,
        true,
        'Oil Slick',
        "Target attacking Pepemon gets -2 to its Attack Power for this turn and the next 3 turns. (Unstackable 3, Unresettable 3) Effects do not stack with another card of the same name.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Oil%20Slick.png',
        'Rare'
    ],
    [
        '0x0000000000000000fffe00000000000000000000000000000000000000000000',
        '0x0000000000000000fffe00000000000000000000000000000000000000000000',
        '0x00',
        4,
        false,
        false,
        true,
        'Pit Trap',
        "Target attacking Pepemon gets -2 Defense Power for this turn and the next 3 turns. (Unstackable 3, Unresettable 3) Effects do not stack with another card of the same name.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Pit%20Trap.png',
        'Rare'
    ],
    [
        '0x0000000000000000fffb00000000000000000000000000000000000000000000',
        '0x0000000000000000fffb00000000000000000000000000000000000000000000',
        '0x00',
        3,
        false,
        false,
        true,
        'Rug Pull',
        "Target attacking Pepemon gets -5 Defense Power for this turn and the next 2 turns. (Unstackable 2, Unresettable 2) Effects do not stack with another card of the same name.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Rug%20Pull.png',
        'Epic'
    ],
    [
        '0x0000000000000000000000000000000000000000000003ee0000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0c',
        1,
        true,
        false,
        false,
        'Second Wind',
        "Pepemon adds +1 to Attack Power until end of turn. However, if the current HP of the Pepemon is less than half that of the start of the battle, add an additional gets +5 attack Power until end of turn.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Second%20Wind.png',
        'Rare'
    ],
    [
        '0x00000000000000000000000000000000000000000000000007d8000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0c',
        1,
        false,
        false,
        false,
        'Determination',
        "Pepemon adds +2 to Defense Power until end of turn. However, if the current HP is less than 50% than of the start of the battle, the Pepemon has an additional +6 Defense until end of turn.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Determination.png',
        'Rare'
    ],
    [
        '0x00000000000000000000000000000000000000000000fff90000000000000000',
        '0x0000000000000000000000000000000000000000000000070000000000000000',
        '0x00',
        3,
        true,
        false,
        true,
        'Inflate',
        "Pepemon reduces its attack power by -7 for this turn, to gain +7 Attack Power for the next two turns. (Unstackable 2, Unresettable 2) Effects do not stack with another card of the same name.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Inflate.png',
        'Rare'
    ],
    [
        '0x00000000000000000000000000000000000000000000fff60000000000000000',
        '0x00000000000000000000000000000000000000000000000a0000000000000000',
        '0x00',
        3,
        true,
        false,
        true,
        'Power Surge',
        "Pepemon reduces its attack power by -10 for this turn, to gain +10 Attack Power for the next two turns. (Unstackable 2, Unresettable 2) Effects do not stack with another card of the same name.",
        'https://bafybeialgr66v43n6piygkr365qo75hjgmmgemobddcq7wyemp3cxibdpi.ipfs.dweb.link/Power%20Surge.png',
        'Epic'
    ]
]

export const SUPPORTCARDS_ORACLE = [
[
    /* "supportCardId"      */  27,
    /* "supportCardType"    */  2,
    /* "effectOne": {       */  [
    /*     "basePower"      */    3,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    2,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  29,
    /* "supportCardType"    */  2,
    /* "effectOne": {       */  [
    /*     "basePower"      */    5,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    2,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  32,
    /* "supportCardType"    */  3,
    /* "effectOne": {       */  [
    /*     "basePower"      */    9,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    3,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    1,
    /*   "numTurns"         */    2,
    /*   "effectTo"         */    5,
    /*   "effectFor"        */    1,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  1,
    /* "unresettable"       */  1
],
[
    /* "supportCardId"      */  47,
    /* "supportCardType"    */  3,
    /* "effectOne": {       */  [
    /*     "basePower"      */    2,
    /*     "triggeredPower" */    6,
    /*     "effectTo"       */    3,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    11
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    5,
    /*   "effectFor"        */    1,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  18,
    /* "supportCardType"    */  0,
    /* "effectOne": {       */  [
    /*     "basePower"      */    1,
    /*     "triggeredPower" */    6,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    1
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  17,
    /* "supportCardType"    */  0,
    /* "effectOne": {       */  [
    /*     "basePower"      */    4,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  14,
    /* "supportCardType"    */  0,
    /* "effectOne": {       */  [
    /*     "basePower"      */    4,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  30,
    /* "supportCardType"    */  2,
    /* "effectOne": {       */  [
    /*     "basePower"      */    6,
    /*     "triggeredPower" */    6,
    /*     "effectTo"       */    2,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    6
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  35,
    /* "supportCardType"    */  3,
    /* "effectOne": {       */  [
    /*     "basePower"      */    0,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    1,
    /*   "numTurns"         */    2,
    /*   "effectTo"         */    5,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  1,
    /* "unresettable"       */  1
],
[
    /* "supportCardId"      */  25,
    /* "supportCardType"    */  1,
    /* "effectOne": {       */  [
    /*     "basePower"      */    0,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    5,
    /*   "numTurns"         */    3,
    /*   "effectTo"         */    4,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  1,
    /* "unresettable"       */  1
],
[
    /* "supportCardId"      */  41,
    /* "supportCardType"    */  2,
    /* "effectOne": {       */  [
    /*     "basePower"      */    -3,
    /*     "triggeredPower" */    -7,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    1,
    /*     "reqCode"        */    8
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  19,
    /* "supportCardType"    */  0,
    /* "effectOne": {       */  [
    /*     "basePower"      */    1,
    /*     "triggeredPower" */    8,
    /*     "effectTo"       */    2,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    2
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  21,
    /* "supportCardType"    */  1,
    /* "effectOne": {       */  [
    /*     "basePower"      */    6,
    /*     "triggeredPower" */    3,
    /*     "effectTo"       */    1,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    4
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  48,
    /* "supportCardType"    */  1,
    /* "effectOne": {       */  [
    /*     "basePower"      */    -7,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    1,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    7,
    /*   "numTurns"         */    2,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  1,
    /* "unresettable"       */  1
],
[
    /* "supportCardId"      */  23,
    /* "supportCardType"    */  1,
    /* "effectOne": {       */  [
    /*     "basePower"      */    0,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    1,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    1
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  34,
    /* "supportCardType"    */  3,
    /* "effectOne": {       */  [
    /*     "basePower"      */    2,
    /*     "triggeredPower" */    12,
    /*     "effectTo"       */    2,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    10
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  42,
    /* "supportCardType"    */  3,
    /* "effectOne": {       */  [
    /*     "basePower"      */    -3,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    1,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    -3,
    /*   "numTurns"         */    2,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    1,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  1,
    /* "unresettable"       */  1
],
[
    /* "supportCardId"      */  43,
    /* "supportCardType"    */  3,
    /* "effectOne": {       */  [
    /*     "basePower"      */    -2,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    1,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    -2,
    /*   "numTurns"         */    3,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    1,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  1,
    /* "unresettable"       */  1
],
[
    /* "supportCardId"      */  31,
    /* "supportCardType"    */  2,
    /* "effectOne": {       */  [
    /*     "basePower"      */    5,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    2,
    /*     "effectFor"      */    1,
    /*     "reqCode"        */    7
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  44,
    /* "supportCardType"    */  3,
    /* "effectOne": {       */  [
    /*     "basePower"      */    -2,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    2,
    /*     "effectFor"      */    1,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    -2,
    /*   "numTurns"         */    3,
    /*   "effectTo"         */    2,
    /*   "effectFor"        */    1,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  1,
    /* "unresettable"       */  1
],
[
    /* "supportCardId"      */  36,
    /* "supportCardType"    */  0,
    /* "effectOne": {       */  [
    /*     "basePower"      */    -4,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    2,
    /*     "effectFor"      */    1,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    1,
    /*   "numTurns"         */    1,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  49,
    /* "supportCardType"    */  1,
    /* "effectOne": {       */  [
    /*     "basePower"      */    -10,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    10,
    /*   "numTurns"         */    2,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  1,
    /* "unresettable"       */  1
],
[
    /* "supportCardId"      */  12,
    /* "supportCardType"    */  0,
    /* "effectOne": {       */  [
    /*     "basePower"      */    2,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  15,
    /* "supportCardType"    */  0,
    /* "effectOne": {       */  [
    /*     "basePower"      */    2,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  11,
    /* "supportCardType"    */  0,
    /* "effectOne": {       */  [
    /*     "basePower"      */    2,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  16,
    /* "supportCardType"    */  0,
    /* "effectOne": {       */  [
    /*     "basePower"      */    3,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  13,
    /* "supportCardType"    */  0,
    /* "effectOne": {       */  [
    /*     "basePower"      */    3,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  39,
    /* "supportCardType"    */  1,
    /* "effectOne": {       */  [
    /*     "basePower"      */    0,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    5,
    /*     "effectFor"      */    1,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    -1,
    /*   "numTurns"         */    2,
    /*   "effectTo"         */    5,
    /*   "effectFor"        */    1,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  1,
    /* "unresettable"       */  1
],
[
    /* "supportCardId"      */  45,
    /* "supportCardType"    */  3,
    /* "effectOne": {       */  [
    /*     "basePower"      */    0,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    2,
    /*     "effectFor"      */    1,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    -5,
    /*   "numTurns"         */    2,
    /*   "effectTo"         */    2,
    /*   "effectFor"        */    1,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  1,
    /* "unresettable"       */  1
],
[
    /* "supportCardId"      */  46,
    /* "supportCardType"    */  1,
    /* "effectOne": {       */  [
    /*     "basePower"      */    1,
    /*     "triggeredPower" */    5,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    1,
    /*     "reqCode"        */    11
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  28,
    /* "supportCardType"    */  2,
    /* "effectOne": {       */  [
    /*     "basePower"      */    4,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    2,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  37,
    /* "supportCardType"    */  0,
    /* "effectOne": {       */  [
    /*     "basePower"      */    -5,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    2,
    /*     "effectFor"      */    1,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  20,
    /* "supportCardType"    */  1,
    /* "effectOne": {       */  [
    /*     "basePower"      */    7,
    /*     "triggeredPower" */    7,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    3
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  38,
    /* "supportCardType"    */  1,
    /* "effectOne": {       */  [
    /*     "basePower"      */    -3,
    /*     "triggeredPower" */    2,
    /*     "effectTo"       */    2,
    /*     "effectFor"      */    1,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    -3,
    /*   "numTurns"         */    2,
    /*   "effectTo"         */    2,
    /*   "effectFor"        */    1,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  1,
    /* "unresettable"       */  1
],
[
    /* "supportCardId"      */  33,
    /* "supportCardType"    */  3,
    /* "effectOne": {       */  [
    /*     "basePower"      */    2,
    /*     "triggeredPower" */    7,
    /*     "effectTo"       */    3,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    9
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  24,
    /* "supportCardType"    */  3,
    /* "effectOne": {       */  [
    /*     "basePower"      */    0,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    1
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    0,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  0,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  26,
    /* "supportCardType"    */  1,
    /* "effectOne": {       */  [
    /*     "basePower"      */    2,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    1,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    2,
    /*   "numTurns"         */    3,
    /*   "effectTo"         */    1,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  1,
    /* "unresettable"       */  1
],
[
    /* "supportCardId"      */  22,
    /* "supportCardType"    */  1,
    /* "effectOne": {       */  [
    /*     "basePower"      */    0,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    1,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    0,
    /*   "numTurns"         */    0,
    /*   "effectTo"         */    1,
    /*   "effectFor"        */    0,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  1,
    /* "unresettable"       */  0
],
[
    /* "supportCardId"      */  40,
    /* "supportCardType"    */  2,
    /* "effectOne": {       */  [
    /*     "basePower"      */    0,
    /*     "triggeredPower" */    0,
    /*     "effectTo"       */    0,
    /*     "effectFor"      */    0,
    /*     "reqCode"        */    0
    /* },                   */  ],
    /* "effectMany": {      */  [
    /*   "power"            */    -1,
    /*   "numTurns"         */    2,
    /*   "effectTo"         */    5,
    /*   "effectFor"        */    1,
    /*   "reqCode"          */    0
    /* },                   */  ],
    /* "unstackable"        */  1,
    /* "unresettable"       */  1
],
  [
    50,
    1,
    [
      1,
      0,
      3,
      0,
      2
    ],
    [
      3,
      0,
      1,
      1,
      6
    ],
    false,
    true
  ],
  [
    51,
    1,
    [
      1,
      0,
      3,
      0,
      2
    ],
    [
      3,
      0,
      1,
      1,
      6
    ],
    false,
    true
  ],
  [
    52,
    1,
    [
      1,
      0,
      3,
      0,
      2
    ],
    [
      3,
      0,
      1,
      1,
      6
    ],
    false,
    true
  ]
]


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {};

export default func;
