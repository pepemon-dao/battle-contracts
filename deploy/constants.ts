import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

export const RNG_ORACLE = 'SampleChainLinkRngOracle';
export const PEPEMON_DECK = 'PepemonCardDeck';
export const PEPEMON_CARD_ORACLE = 'PepemonCardOracle';
export const PEPEMON_BATTLE = 'PepemonBattle';
export const PEPEMON_FACTORY = 'PepemonFactory';
export const PEPEMON_MATCHMAKER = 'PepemonMatchmaker';
export const PEPEMON_REWARDPOOL = 'PepemonRewardPool';

export const DEFAULT_RANKING = 2000;

export const USE_TESTNET_ADDRESSES = true;

// let addrSupportCard;
// let addrBattleCard;
// let addrCardOracle;

// const targetChain: String = "pepechain-testnet";
// switch (targetChain) {
//   case "pepechain-testnet":
//     addrSupportCard = '0x22895c1acdABC95191fe776E2953B984abCa1C40';
//     addrBattleCard = '0x22895c1acdABC95191fe776E2953B984abCa1C40';
//     addrCardOracle = '0x565863d53d060E34b9a9320EF9a9c7653fA16898';
//     break;
//   case "fantom-testnet":
//     addrSupportCard = '0x9460DfaAD34Bc55ee564A6851c58DFC390D7d4ac';
//     addrBattleCard = '0x9460DfaAD34Bc55ee564A6851c58DFC390D7d4ac';
//     addrCardOracle = '0x888c830242caAa352DC506a2C79d38B3e86102aD';
//     break;
//   default:
//     throw "Unknown chain";
// }

// export const SUPPORT_CARD_ADDRESS = addrSupportCard;
// export const BATTLE_CARD_ADDRESS  = addrBattleCard;
// export const ORACLE_ADDRESS       = addrCardOracle;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {};

export default func;
