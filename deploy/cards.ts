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
        /*ipfsAddr      */ 'bafybeidlnhr2lbagflwvmsfn2jxo4o4nfbpxvl5moisjg7mpjouultjdvu.ipfs.4everland.io',
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
        /*ipfsAddr      */ 'bafybeif2gvjhmrt7f5urjkozphacfixznxv2at4vz57nn665e7dj6q23g4.ipfs.4everland.io',
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
        /*ipfsAddr      */ 'bafybeid6fcfd7u4majcppyw4fm4kurtppyaxrd3moh2ohwd6en6zuu7qce.ipfs.4everland.io',
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
        /*ipfsAddr      */ 'bafybeia6y7u3opxyfx2fbnjzaqk5epu5s5nzwsmwicb74boqeoc2c5xgru.ipfs.4everland.io',
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
        /*ipfsAddr      */ 'bafybeiftmddhvivn4eqqctfdbkfvbxrm7gstb6w5yyobigajuef36bci7e.ipfs.4everland.io',
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
        /*ipfsAddr      */ 'bafybeid6wha7u4xuq5um4akebrdel6eyfswbmwkqhrqkytw5xeleg2adke.ipfs.4everland.io',
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
        /*ipfsAddr      */ 'bafybeifcf7g3antv22jqmbjp4lmfw2j6on3wa7ymxjrgb4jiar44dkgizm.ipfs.4everland.io',
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
        /*ipfsAddr      */ 'bafybeiepzyh57bqkqm56pxz47m6nfuytbrbbka56xn4b2xigovxeu3jyre.ipfs.4everland.io',
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
        /*ipfsAddr      */ 'bafybeigvgrxnkzzfoezvhucnbgrdbfxuwoafmqajygsidyzlbqwkuvmcda.ipfs.4everland.io',
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
        /*ipfsAddr      */ 'bafybeickwajtkzp5tpuuvg5et6b5fzpuqie2yg2cm7tpssyne536deh32e.ipfs.4everland.io',
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
        /*ipfsAddr           */  'bafybeicmjksqu6sdeunqwad2symlvhhsccflbrqqy2uuereipvrtdv2jbq.ipfs.4everland.io',
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
        'bafybeicmjksqu6sdeunqwad2symlvhhsccflbrqqy2uuereipvrtdv2jbq.ipfs.4everland.io',
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
        'bafybeigvy64f5fm565ulm7fbkifq6mxu4nskyyl5dzt7zdzuaizhakn6va.ipfs.4everland.io',
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
        'bafybeia2d746ifydj24nwpopzxrlhshwnsu3auwcvbyiimtrj5vacafjly.ipfs.4everland.io',
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
        'bafybeicmjksqu6sdeunqwad2symlvhhsccflbrqqy2uuereipvrtdv2jbq.ipfs.4everland.io',
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
        'bafybeigvy64f5fm565ulm7fbkifq6mxu4nskyyl5dzt7zdzuaizhakn6va.ipfs.4everland.io',
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
        'bafybeia2d746ifydj24nwpopzxrlhshwnsu3auwcvbyiimtrj5vacafjly.ipfs.4everland.io',
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
        "bafybeibmdlxm2dinpjckjvzixwxiv2rgj4pobljrgkausudoi533lwbd6q.ipfs.4everland.io",
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
        'bafybeickp3mu3slocwrihfe6eopl5nrwhnoqsrjnr256exfgk42yvmo6qi.ipfs.4everland.io',
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
        'bafybeieuhp5jddt5ookwvv5xpv44rguos2yl5cqrn22t67m4btamnrgcte.ipfs.4everland.io',
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
        'bafybeicdbyfeclm5wnas4s5luwova5earfatszebqwwof2me46lfyrbzie.ipfs.4everland.io',
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
        'bafybeibgrghywajjixdzzwhv3qxxnkmj7lfrkopnzii76hz3yng6aprn5e.ipfs.4everland.io',
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
        'bafybeia5r2x5htgm6rwn3ai7rkpkdbe6sqpqvsfrojumbguh6owno6s32y.ipfs.4everland.io',
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
        'bafybeidkhl7xz6fw5xfsvvh2z5lxcmwfurklmmbnb72j3odnuhezrwbovy.ipfs.4everland.io',
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
        'bafybeidzacvsklpjfrnq6figx2rlraamb47uipms7ogdn3itjojhy44poq.ipfs.4everland.io',
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
        'bafybeihhe64rax6zdb6ljw4xbwouwybjczz6ovqrqzzae7lj5c5tckzu5y.ipfs.4everland.io',
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
        'bafybeihnf3vomt6uev6l6b3nwoqiqugkfjqosc7th3mzgfqp3duxrgaia4.ipfs.4everland.io',
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
        'bafybeigqjzncagntypofo7bqdzitmuf7ocyrt7wxlpiifhiigcj7orea6y.ipfs.4everland.io',
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
        'bafybeiblie3yg7art332zms5s6kwthlhuwhejs3mhe56ysvpl5qkwyincu.ipfs.4everland.io',
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
        'bafybeib4m7poladvte7edj6j7wictbi2fwjfmwxpavm5dywah3mycsvm7q.ipfs.4everland.io',
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
        'bafybeibwxcfly6ix7y3goqu3ymun3zamfryjgqrmukl2ag2p32v46svqa4.ipfs.4everland.io',
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
        'bafybeicoqppwgjq2ljeptltmn4537qhkphq7slquhflelwn7kecivof5h4.ipfs.4everland.io',
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
        'bafybeicackkbh2nzkaswcnhwfhej4feovfcs2cplerhowj2fvw2jc2ruo4.ipfs.4everland.io',
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
        'bafybeihm6kxyb3e7xvnkawrieblnrb5zjskhz5mhwvqthsavmcivlswzyy.ipfs.4everland.io',
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
        'bafybeihnruqptiv5a5dz2oiw6blni5njmzgc4aq5esaedz4exlomswipvu.ipfs.4everland.io',
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
        'bafybeigiyn7ttwpwzqblas7x4bluv5jvzhawujnrkvtj3q6eyozvkxuena.ipfs.4everland.io',
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
        'bafybeickbm3eg3xibyhyz4gih7msn3bqmoouif2yvqljtchc3ydgxuv2iu.ipfs.4everland.io',
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
        'bafybeifzx66i7xwgdouvbknesskyzsujinca2k4picznm4yxmdiq4wrzme.ipfs.4everland.io',
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
        'bafybeicjrlxz3zqyisnlftopm6porsckvtmfffpsoagmfs66h4maznse74.ipfs.4everland.io',
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
        'bafybeihl7dt3fpwlgukbosb37dsart32izvswya4nwgcxnwjsblv4ikuqi.ipfs.4everland.io',
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
        'bafybeihebp6alafiwlf753qvwdzodoswvb2qbchtaljwhdcmujd5ffhyty.ipfs.4everland.io',
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
        'bafybeihuzfel7kllr4zzv5nbphs6heciqraaddro2ibpkevyeujigkrzgq.ipfs.4everland.io',
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
        'bafybeidj4mdwdn4k3dydu7tonz36ymdi2oc3im3mw2lhjqeltsvpum4wgu.ipfs.4everland.io',
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
        'bafybeihf6fjgsy4seaprz4gtjsqoht47upym4ojea42tgxjptmlyvxwfcm.ipfs.4everland.io',
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
        'bafybeiezl76oqtive2lc5zj3jgcfuoa5nv6oofk6w6632qz4grbzvwgufy.ipfs.4everland.io',
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
        'bafybeigrapod643nq2x7np6d6xp7rn3nwdlvx7gzagome6uuzaquvpltp4.ipfs.4everland.io',
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
        'bafybeiavo6bi4pf6uyiyputpu3lb3gdspuwdhlx7k3ewn4uthllgvkngji.ipfs.4everland.io',
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
        'bafybeib4bdt2swxv3irmgrhkjlv4d6xv4rezf4qh74ath457dxvb4pzqca.ipfs.4everland.io',
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
        'bafybeiekegco35mo4ugx6fvcuikcig4zwqdqi3xoj4mm7f5qpp5b6qup5q.ipfs.4everland.io',
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
