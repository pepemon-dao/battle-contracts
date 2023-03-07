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

export const USE_TESTNET_ADDRESSES = false;

export const TESTNET_SUPPORT_CARD_ADDRESS = '0x9460DfaAD34Bc55ee564A6851c58DFC390D7d4ac'
export const TESTNET_BATTLE_CARD_ADDRESS = '0x9460DfaAD34Bc55ee564A6851c58DFC390D7d4ac'
export const TESTNET_ORACLE_ADDRESS = '0x888c830242caAa352DC506a2C79d38B3e86102aD'

export const MAINNET_SUPPORT_CARD_ADDRESS = '0x888c830242caAa352DC506a2C79d38B3e86102aD';
export const MAINNET_BATTLE_CARD_ADDRESS = '0x888c830242caAa352DC506a2C79d38B3e86102aD';
export const MAINNET_ORACLE_ADDRESS =  '0x5aC1254f6c8cD976e796c951D7fE92eEF0eB70BE';

export const SUPPORT_CARD_ADDRESS = USE_TESTNET_ADDRESSES ? TESTNET_SUPPORT_CARD_ADDRESS : MAINNET_SUPPORT_CARD_ADDRESS;
export const BATTLE_CARD_ADDRESS  = USE_TESTNET_ADDRESSES ? TESTNET_BATTLE_CARD_ADDRESS  : MAINNET_BATTLE_CARD_ADDRESS
export const ORACLE_ADDRESS       = USE_TESTNET_ADDRESSES ? TESTNET_ORACLE_ADDRESS       : MAINNET_ORACLE_ADDRESS

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {};

export default func;
