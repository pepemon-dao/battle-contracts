import { HardhatUserConfig } from 'hardhat/config';
import environment from './config';

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import "@nomicfoundation/hardhat-verify";

import 'hardhat-typechain';

import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

import 'solidity-coverage';

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
        url: 'https://l2-pepechain-testnet-8uk55qlld4.t.conduit.xyz'
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
      gas: "auto",
      gasPrice: 8000000000,
    },
    // for deployment: make deploy-mumbai
    // make sure to check if scripts under ./deploy are correct!!
    // checking contract: npx hardhat verify CONTRACT_ADDRESS --network mumbai
    mumbai: {
      url: 'https://rpc.ankr.com/polygon_mumbai',
      // silence hardhat error "private key too short, expected 32 bytes" if privateKey is not set
      accounts: [environment.privateKey ? environment.privateKey : '0'.repeat(64)]
    },
    fantom_testnet: {
      url: 'https://rpc.ankr.com/fantom_testnet',
      accounts: [environment.privateKey ? environment.privateKey : '0'.repeat(64)]
    },
    fantom_mainnet: {
      url: 'https://rpc.ankr.com/fantom',
      accounts: [environment.privateKey ? environment.privateKey : '0'.repeat(64)]
    },
    pepechain_testnet: {
      url: 'https://l2-pepechain-testnet-8uk55qlld4.t.conduit.xyz',
      accounts: [environment.privateKey ? environment.privateKey : '0'.repeat(64)]
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
    customChains: [
      {
        network: "pepechain-testnet-8uk55qlld4",
        chainId: 906090,
        urls: {
          apiURL: "https://explorerl2-pepechain-testnet-8uk55qlld4.t.conduit.xyz/api",
          browserURL: "https://explorerl2-pepechain-testnet-8uk55qlld4.t.conduit.xyz"
        }
      }
    ]
  },
  mocha: {
    timeout: 200000,
  },
};

export default config;
