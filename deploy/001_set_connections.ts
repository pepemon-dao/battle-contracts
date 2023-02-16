import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { SUPPORT_CARD_ADDRESS, BATTLE_CARD_ADDRESS, PEPEMON_DECK, PEPEMON_MATCHMAKER, PEPEMON_BATTLE } from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const hardhatTestAddr = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
  const { deployer } = await getNamedAccounts();

  console.log(`Setting support card address: ${SUPPORT_CARD_ADDRESS}`);
  await execute(PEPEMON_DECK, { from: deployer, log: true }, 'setSupportCardAddress', SUPPORT_CARD_ADDRESS);

  console.log(`Setting battle card address: ${BATTLE_CARD_ADDRESS}`);
  await execute(PEPEMON_DECK, { from: deployer, log: true }, 'setBattleCardAddress', BATTLE_CARD_ADDRESS);

  console.log("Setting PepemonMatchmaker's Contract as a PepemonBattle admin...")
  let pepemonMatchmaker = await hre.deployments.get(PEPEMON_MATCHMAKER);
  await hre.deployments.execute(PEPEMON_BATTLE, {from: hardhatTestAddr}, "addAdmin", pepemonMatchmaker.address);
};

export default func;

func.tags = ['SETUP_CARDS'];
func.dependencies = [PEPEMON_DECK];
