import { HardhatUserConfig } from 'hardhat/config';
import environment from './config';

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';

import 'hardhat-typechain';

import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

import 'solidity-coverage';
import 'hardhat-exposed';

console.log("Forking is " + (environment.disableForking ? "disabled" : "enabled"));

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.0',
    // version: "0.7.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  // @ts-ignore  // vscode linter can't find this property. but it works, so ignore the warning 
  exposed: {
    prefix: 'x' // hardhat-exposed config. the default prefix "$" doesn't works well. Use "hardhat compile --force" after changing this
  },
  paths: {
    root: './',
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  defaultNetwork: 'hardhat',
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.g.alchemy.com/v2/' + environment.alchemyRinkebyKey,
      chainId: 4,
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 0,
      },
    },
    hardhat: {
      forking: {
        enabled: !environment.disableForking,
        url: 'https://polygon-mainnet.g.alchemy.com/v2/' + environment.alchemyKey,
      },
      // accounts: {
      //   mnemonic: '',
      //   path: "m/44'/60'/0'/0",
      //   initialIndex: 0,
      //   count: 0,
      // },
      allowUnlimitedContractSize: true,
      initialBaseFeePerGas: 100,
      blockGasLimit: 0x1fffffffffffff,
      gas: 100000000,
      gasPrice: 8000000000,
    },
    // for deployment: npx hardhat deploy --network mumbai
    // make sure to check if scripts under ./deploy are correct!!
    // checking contract: npx hardhat verify CONTRACT_ADDRESS --network mumbai
    mumbai: {
      url: 'https://rpc.ankr.com/polygon_mumbai',
      accounts: [environment.privateKey]
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
      ropsten: '0x40aB75676527ec9830fEAc40e525764405453914',
    },
    admin: {
      default: 0,
      ropsten: '0x40aB75676527ec9830fEAc40e525764405453914',
    },
    proxyOwner: 1,
  },
  etherscan: {
    apiKey: environment.etherScanKey,
  },
  mocha: {
    timeout: 200000,
  },
};

export default config;
