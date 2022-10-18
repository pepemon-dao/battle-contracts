import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

export const RNG_ORACLE = 'SampleChainLinkRngOracle';
export const PEPEMON_DECK = 'PepemonCardDeck';
export const PEPEMON_CARD_ORACLE = 'PepemonCardOracle';
export const PEPEMON_BATTLE = 'PepemonBattle';
export const PEPEMON_FACTORY = 'PepemonFactory';

export const SUPPORT_CARD_ADDRESS = '0xa02e589d5a8e3c0f540ebb931fda0b91d742a79e';
export const BATTLE_CARD_ADDRESS = '0xa02e589d5a8e3c0f540ebb931fda0b91d742a79e';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {};

export default func;
