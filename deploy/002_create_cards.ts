import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ethers } from 'ethers';
import { DeployFunction } from 'hardhat-deploy/types';
import { PEPEMON_FACTORY } from './constants';
import { BATTLECARDS, SUPPORTCARDS } from './cards';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  //const { execute } = deployments;

  let executeWrapper = async (...args: any) => {
    //while (true) {
      try {
        console.log("Executing wrapped: " + args)
        return await deployments.execute(...args);
      } catch (e) {
        console.log("Error: " + e)
        await new Promise(f => setTimeout(f, 5000));
      }
    //}
  }
  const execute = executeWrapper;


  console.log(`Creating battle cards...`);
  for(const stats of BATTLECARDS){
    await new Promise(f => setTimeout(f, 2000));
    console.log(`Creating BattleCard: ${stats[9]}`);
    await execute(PEPEMON_FACTORY, { from: deployer, log: true, gasLimit: 10000000 }, 'createBattleCard', 
      stats,    // _stats
      99999999, // _maxSupply
      0,        // _initialSupply
      "",       // _uri
      [],        // _data
    )
  }

  console.log(`Creating support cards..`);
  for(const stats of SUPPORTCARDS){
    await new Promise(f => setTimeout(f, 2000));
    console.log(`Creating SupportCard: ${stats[7]}`);
    await execute(PEPEMON_FACTORY, { from: deployer, log: true, gasLimit: 10000000 }, 'createSupportCard', 
      stats,    // _stats
      99999999, // _maxSupply
      0,        // _initialSupply
      "",       // _uri
      []        // _data
    )
  }

  console.log("Cards created successfully.");
};

export default func;

func.tags = [PEPEMON_FACTORY, "CREATE_CARDS"];
