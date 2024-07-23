import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction, DeployResult } from 'hardhat-deploy/types';
import { PEPEMON_DECK, PEPEMON_BATTLE, PEPEMON_FACTORY, PEPEMON_CARD_ORACLE, RNG_ORACLE, PEPEMON_MATCHMAKER, PEPEMON_REWARDPOOL, DEFAULT_RANKING, PEPEMON_CONFIG } from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log, execute } = deployments;

  const { deployer } = await getNamedAccounts();

  log(`Deploying ${PEPEMON_CONFIG} Contract from ${deployer}...`);
  let pepemonConfig = await deploy(PEPEMON_CONFIG, { from: deployer, log: true });

  log(`Deploying ${PEPEMON_FACTORY} Contract from ${deployer}...`);
  let pepemonFactory = await deploy(PEPEMON_FACTORY, { from: deployer, log: true });

  log(`Deploying ${PEPEMON_CARD_ORACLE} Contract from ${deployer}...`);
  let PepemonCardOracle = await deploy(PEPEMON_CARD_ORACLE, { from: deployer, log: true });

  log(`Deploying ${RNG_ORACLE} Contract from ${deployer}...`);
  let rngOracle = await deploy(RNG_ORACLE, { from: deployer, log: true });

  log(`Deploying ${PEPEMON_DECK} Contract from ${deployer}....`);
  let deckContract = await deploy(PEPEMON_DECK, {
    from: deployer, 
    log: true, 
    args: [
      pepemonConfig.address
    ]
  });

  log(`Deploying ${PEPEMON_BATTLE} Contract from ${deployer}....`);
  let pepemonBattle = await deploy(
    PEPEMON_BATTLE,
    {
      from: deployer,
      log: true,
      args: [
        pepemonConfig.address
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
        pepemonConfig.address
      ]
    }
  );

  async function save_address_config(contract: string, deployment: DeployResult) {
    console.log(`Saving address of ${contract} in ${PEPEMON_CONFIG}...`)
    await execute(PEPEMON_CONFIG, { from: deployer, log: true }, "setContractAddress", contract, deployment.address, false);

    // save this deployment to use its address in 001_set_connections.ts
    await hre.deployments.save(contract, {
      abi: deployment.abi,
      address: deployment.address,
    });
  }

  await save_address_config(PEPEMON_FACTORY, pepemonFactory);
  await save_address_config(PEPEMON_CARD_ORACLE, PepemonCardOracle);
  await save_address_config(PEPEMON_DECK, deckContract);
  await save_address_config(RNG_ORACLE, rngOracle);
  await save_address_config(PEPEMON_BATTLE, pepemonBattle);
  await save_address_config(PEPEMON_REWARDPOOL, rewardPoolContract);
  await save_address_config(PEPEMON_MATCHMAKER, pepemonMatchmaker);

  await hre.deployments.save(PEPEMON_CONFIG, {
    abi: pepemonConfig.abi,
    address: pepemonConfig.address,
  });
};

export default func;

func.tags = [PEPEMON_DECK, PEPEMON_BATTLE, PEPEMON_FACTORY, PEPEMON_CARD_ORACLE, RNG_ORACLE, PEPEMON_MATCHMAKER, PEPEMON_REWARDPOOL];
