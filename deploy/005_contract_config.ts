import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { PEPEMON_MATCHMAKER, PEPEMON_DECK, PEPEMON_BATTLE, PEPEMON_FACTORY } from './constants';
import { BATTLECARDS, SUPPORTCARDS } from './cards';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  
  let executeWrapper = async (...args: any) => {
    //while (true) {
      try {
        console.log("Executing wrapped: " + args)
        return await hre.deployments.execute(...args);
      } catch (e) {
        console.log("Error: " + e)
        await new Promise(f => setTimeout(f, 5000));
      }
    //}
  }
  const execute = executeWrapper;

  const firstCardId = 1;
  const lastCardId = BATTLECARDS.length + SUPPORTCARDS.length;

  let deckContract = await hre.deployments.get(PEPEMON_DECK);

  // Set defaults
  await execute(PEPEMON_DECK, { from: deployer, log: true, gasLimit: 10000000 }, 'setMinSupportCards', 1);
  await execute(PEPEMON_DECK, { from: deployer, log: true, gasLimit: 10000000 }, 'setMaxSupportCards', 60);

  // allows minting test cards
  await execute(PEPEMON_FACTORY, {from: deployer, log: true, gasLimit: 10000000 }, "addMinter", deckContract.address);
  await execute(PEPEMON_DECK, { from: deployer, log: true, gasLimit: 10000000 }, 'setMintingCards', firstCardId, lastCardId);

  // Allow fighting yourself
  await execute(PEPEMON_MATCHMAKER, {from: deployer, log: true, gasLimit: 10000000 }, "setAllowBattleAgainstOneself", true);
  await execute(PEPEMON_BATTLE, {from: deployer, log: true, gasLimit: 10000000 }, "setAllowBattleAgainstOneself", true);
};

export default func;

func.tags = ['CONTRACT_CONFIG'];
func.dependencies = [PEPEMON_DECK, PEPEMON_MATCHMAKER, PEPEMON_FACTORY, PEPEMON_BATTLE]
