import * as dotenv from 'dotenv';

dotenv.config();

export default {
  disableForking: (process.env.DISABLE_FORKING ?? '0') != '0',
  privateKey: process.env.PRIVATE_KEY ?? '',
  etherScanKey: process.env.ETHERSCAN_API_KEY ?? '',
  ftmTestnetApiKey: process.env.FANTOM_API_KEY ?? '',
  infuraKey: process.env.INFURA_API_KEY ?? '',
  alchemyKey: process.env.ALCHEMY_API_KEY ?? '',
  alchemyRinkebyKey: process.env.ALCHEMY_RINKEBY_API_KEY ?? '',
};
