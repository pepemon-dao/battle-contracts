import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { SUPPORT_CARD_ADDRESS, BATTLE_CARD_ADDRESS, PEPEMON_DECK } from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  console.log(`Setting support card address: ${SUPPORT_CARD_ADDRESS}`);
  await execute(PEPEMON_DECK, { from: deployer, log: true }, 'setSupportCardAddress', SUPPORT_CARD_ADDRESS);

  console.log(`Setting battle card address: ${BATTLE_CARD_ADDRESS}`);
  await execute(PEPEMON_DECK, { from: deployer, log: true }, 'setBattleCardAddress', BATTLE_CARD_ADDRESS);
};

export default func;

func.tags = ['SETUP_CARDS'];
func.dependencies = [PEPEMON_DECK];
