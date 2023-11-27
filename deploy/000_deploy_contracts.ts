import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { PEPEMON_DECK, PEPEMON_BATTLE, PEPEMON_FACTORY, PEPEMON_CARD_ORACLE, RNG_ORACLE, PEPEMON_MATCHMAKER, PEPEMON_REWARDPOOL, DEFAULT_RANKING } from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();
  
  log(`Deploying ${PEPEMON_FACTORY} Contract from ${deployer}...`);
  let pepemonFactory = await deploy(PEPEMON_FACTORY, { from: deployer, log: true });

  log(`Deploying ${PEPEMON_CARD_ORACLE} Contract from ${deployer}...`);
  let PepemonCardOracle = await deploy(PEPEMON_CARD_ORACLE, { from: deployer, log: true });

  log(`Deploying ${RNG_ORACLE} Contract from ${deployer}...`);
  let rngOracle = await deploy(RNG_ORACLE, { from: deployer, log: true });

  log(`Deploying ${PEPEMON_DECK} Contract from ${deployer}....`);
  let deckContract = await deploy(PEPEMON_DECK, { from: deployer, log: true });

  log(`Deploying ${PEPEMON_BATTLE} Contract from ${deployer}....`);
  let pepemonBattle = await deploy(
    PEPEMON_BATTLE,
    {
      from: deployer,
      log: true,
      args: [
        PepemonCardOracle.address,
        deckContract.address,
        rngOracle.address
      ]
    },
  );

  log(`Deploying ${PEPEMON_REWARDPOOL} Contract from ${deployer}....`);
  let rewardPoolContract = await deploy(PEPEMON_REWARDPOOL, { from: deployer, log: true });

  log(`Deploying ${PEPEMON_MATCHMAKER} Contract from ${deployer}....`);
  let pepemonMatchmaker = await deploy(
    PEPEMON_MATCHMAKER,
    {
      from: deployer,
      log: true,
      args: [
        DEFAULT_RANKING,
        pepemonBattle.address,
        deckContract.address,
        rewardPoolContract.address
      ]
    }
  );

  // save this deployment to use its address in 002_prepare_test_env.ts
  await hre.deployments.save(PEPEMON_MATCHMAKER, {
    abi: pepemonMatchmaker.abi,
    address: pepemonMatchmaker.address,
  });
  
  await hre.deployments.save(PEPEMON_DECK, {
    abi: deckContract.abi,
    address: deckContract.address,
  });
  
}; 

export default func;

func.tags = [PEPEMON_DECK, PEPEMON_BATTLE, PEPEMON_FACTORY, PEPEMON_CARD_ORACLE, RNG_ORACLE, PEPEMON_MATCHMAKER, PEPEMON_REWARDPOOL];
