import { getWallets } from './helpers/contract';
import RNGArtifact from '../artifacts/contracts/SampleChainLinkRngOracle.sol/SampleChainLinkRngOracle.json';
import { ChainLinkRngOracle } from '../typechain';
import { expect } from 'chai';
import { deployContract } from 'ethereum-waffle';
import { Contract } from 'ethers';

const [alice, bob] = getWallets();

describe('Chainlink Random Numnber', async () => {
  let randomNumberContract: ChainLinkRngOracle;

  beforeEach(async () => {
    randomNumberContract = (await deployContract(alice, RNGArtifact)) as ChainLinkRngOracle;
  });

  describe('Get Random Number', async () => {
    it('should get random number from chainLink', async () => {
      await randomNumberContract.getRandomNumber().then((randomNumber: any) => {
        console.log('Random number: ', randomNumber);
      });
    });
  });
});
