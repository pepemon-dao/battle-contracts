import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { PEPEMON_DECK, PEPEMON_BATTLE, PEPEMON_CARD_ORACLE, RNG_ORACLE } from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();

  log(`Deploying ${RNG_ORACLE} Contract from ${deployer}...`);
  let rngOracle = await deploy(RNG_ORACLE, { from: deployer, log: true });

  log(`Deploying ${PEPEMON_DECK} Contract from ${deployer}....`);
  let deckContract = await deploy(PEPEMON_DECK, { from: deployer, log: true });

  log(`Deploying ${PEPEMON_CARD_ORACLE} Contract from ${deployer}....`);
  let oracleContract = await deploy(PEPEMON_CARD_ORACLE, { from: deployer, log: true });

  log(`Deploying ${PEPEMON_BATTLE} Contract from ${deployer}....`);
  await deploy(
    PEPEMON_BATTLE,
    {
      from: deployer,
      log: true,
      args: [
        oracleContract.address,
        deckContract.address,
        rngOracle.address
      ]
    },
  );
};

export default func;

func.tags = [PEPEMON_DECK, PEPEMON_BATTLE, PEPEMON_CARD_ORACLE, RNG_ORACLE];
