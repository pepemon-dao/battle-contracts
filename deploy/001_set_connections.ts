import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { PEPEMON_FACTORY, PEPEMON_DECK, PEPEMON_MATCHMAKER, PEPEMON_BATTLE, PEPEMON_REWARDPOOL } from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();
  
  let pepemonFactory = await hre.deployments.get(PEPEMON_FACTORY);

  console.log(`Setting support card address: ${pepemonFactory.address}`);
  await execute(PEPEMON_DECK, { from: deployer, log: true }, 'setSupportCardAddress', pepemonFactory.address);

  console.log(`Setting battle card address: ${pepemonFactory.address}`);
  await execute(PEPEMON_DECK, { from: deployer, log: true }, 'setBattleCardAddress', pepemonFactory.address);

  let pepemonMatchmaker = await hre.deployments.get(PEPEMON_MATCHMAKER);

  console.log("Setting PepemonMatchmaker's Contract as a PepemonBattle admin...")
  await execute(PEPEMON_BATTLE, {from: deployer, log: true }, "addAdmin", pepemonMatchmaker.address);

  console.log("Setting PepemonMatchmaker's Contract as a PepemonRewardPool admin...")
  await execute(PEPEMON_REWARDPOOL, {from: deployer, log: true }, "addAdmin", pepemonMatchmaker.address);
};

export default func;

func.tags = ['SETUP_CARDS'];
func.dependencies = [PEPEMON_DECK];
