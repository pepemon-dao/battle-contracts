import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { PEPEMON_DECK, PEPEMON_MATCHMAKER, PEPEMON_BATTLE, PEPEMON_REWARDPOOL, PEPEMON_CONFIG, PEPEMON_MATCHMAKER_PVE } from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();
  
  let pepemonConfig = await hre.deployments.get(PEPEMON_CONFIG);

  async function sync_config(contract: string) {
    console.log(`Setting PepemonConfig Contract as a ${contract} admin...`)
    await execute(contract, {from: deployer, log: true }, "addAdmin", pepemonConfig.address);

    console.log(`Syncig ${contract} config...`)
    await execute(PEPEMON_CONFIG, { from: deployer, log: true }, "syncContractConfig", contract);
  }

  await sync_config(PEPEMON_BATTLE);
  await sync_config(PEPEMON_MATCHMAKER);
  await sync_config(PEPEMON_MATCHMAKER_PVE);
  await sync_config(PEPEMON_DECK);

  let pepemonMatchmaker = await hre.deployments.get(PEPEMON_MATCHMAKER);
  let pepemonMatchmakerPve = await hre.deployments.get(PEPEMON_MATCHMAKER_PVE);

  console.log("Setting PepemonMatchmaker's Contract as a PepemonBattle admin...")
  await execute(PEPEMON_BATTLE, {from: deployer, log: true }, "addAdmin", pepemonMatchmaker.address);

  console.log("Setting PepemonMatchmaker's Contract as a PepemonRewardPool admin...")
  await execute(PEPEMON_REWARDPOOL, {from: deployer, log: true }, "addAdmin", pepemonMatchmaker.address);

  console.log("Setting PepemonMatchmakerPve's Contract as a PepemonBattle admin...")
  await execute(PEPEMON_BATTLE, {from: deployer, log: true }, "addAdmin", pepemonMatchmakerPve.address);

  console.log("Setting PepemonMatchmakerPve's Contract as a PepemonRewardPool admin...")
  await execute(PEPEMON_REWARDPOOL, {from: deployer, log: true }, "addAdmin", pepemonMatchmakerPve.address);
};

export default func;

func.tags = ['SETUP_CARDS'];
func.dependencies = [PEPEMON_DECK];
