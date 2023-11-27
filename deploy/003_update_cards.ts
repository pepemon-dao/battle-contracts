import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ethers } from 'ethers';
import { DeployFunction } from 'hardhat-deploy/types';
import { PEPEMON_FACTORY } from './constants';
import { BATTLECARDS, SUPPORTCARDS } from './cards';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { execute } = deployments;

  var tokenId = 1;

  console.log(`Updating battle cards...`);
  for(const stats of BATTLECARDS){
    console.log(`Updating BattleCard: ${stats[9]}`);
    await execute(PEPEMON_FACTORY, { from: deployer, log: true }, 'setBattleCardStats',
      tokenId,
      stats    // _stats
    )

    tokenId++;
  }

  console.log(`Updating support cards...`);
  for(const stats of SUPPORTCARDS){
    console.log(`Updating BattleCard: ${stats[7]}`);
    await execute(PEPEMON_FACTORY, { from: deployer, log: true }, 'setSupportCardStats',
      tokenId,
      stats    // _stats
    )

    tokenId++;
  }

  console.log("Cards updated successfully.");
};

export default func;

func.tags = [PEPEMON_FACTORY, "UPDATE_CARDS"];
