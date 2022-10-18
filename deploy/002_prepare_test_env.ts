import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { PEPEMON_FACTORY, SUPPORT_CARD_ADDRESS } from './constants';
import { PEPEMON_DECK, PEPEMON_BATTLE, PEPEMON_CARD_ORACLE, RNG_ORACLE } from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;
  const { deployer } = await getNamedAccounts();

  const testCardOwnerAddr = '0x9615c6684686572D77D38d5e25Bc58472560E22C';
  const hardhatTestAddr = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';

  // Impersonate to take some cards from the creator
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [testCardOwnerAddr]
  });
  const signer = await hre.ethers.getSigner(testCardOwnerAddr);
  
  console.log("Loading PepemonFactory ...")
  const pepemonFactory = await hre.ethers.getContractAt("PepemonFactory", SUPPORT_CARD_ADDRESS, signer);

  var promises = []
  for (var i = 1; i < 10; i++) {
    console.log(`Transferring card ${i} from ${testCardOwnerAddr} to ${hardhatTestAddr}`);
    promises.push(pepemonFactory.safeTransferFrom(testCardOwnerAddr, hardhatTestAddr, i, 1, []));
  }
  await Promise.all(promises);

  // Stop impersonating
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [testCardOwnerAddr]
  });
};

export default func;

func.tags = ['test-env'];
func.dependencies = [PEPEMON_DECK, PEPEMON_BATTLE, PEPEMON_CARD_ORACLE, RNG_ORACLE, 'SETUP_CARDS']
