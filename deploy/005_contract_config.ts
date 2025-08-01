import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { PEPEMON_MATCHMAKER, PEPEMON_DECK, PEPEMON_BATTLE, PEPEMON_FACTORY } from './constants';
import { BATTLECARDS, SUPPORTCARDS } from './cards';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  
  const firstCardId = 1;
  const lastCardId = BATTLECARDS.length + SUPPORTCARDS.length;

  let deckContract = await hre.deployments.get(PEPEMON_DECK);

  // Set defaults
  await hre.deployments.execute(PEPEMON_DECK, { from: deployer, log: true }, 'setMinSupportCards', 1);
  await new Promise(f => setTimeout(f, 5000));
  await hre.deployments.execute(PEPEMON_DECK, { from: deployer, log: true }, 'setMaxSupportCards', 60);
  await new Promise(f => setTimeout(f, 5000));

  // allows minting test cards
  await hre.deployments.execute(PEPEMON_FACTORY, {from: deployer, log: true  }, "addMinter", deckContract.address);
  await new Promise(f => setTimeout(f, 5000));
  await hre.deployments.execute(PEPEMON_DECK, { from: deployer, log: true }, 'setMintingCards', firstCardId, lastCardId);
  await new Promise(f => setTimeout(f, 5000));

  // Allow fighting yourself
  await hre.deployments.execute(PEPEMON_MATCHMAKER, {from: deployer, log: true }, "setAllowBattleAgainstOneself", true);
  await new Promise(f => setTimeout(f, 5000));
  await hre.deployments.execute(PEPEMON_BATTLE, {from: deployer, log: true }, "setAllowBattleAgainstOneself", true);
};

export default func;

func.tags = ['CONTRACT_CONFIG'];
func.dependencies = [PEPEMON_DECK, PEPEMON_MATCHMAKER, PEPEMON_FACTORY, PEPEMON_BATTLE]
