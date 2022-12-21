import { deployMatchmakerContract, getWallets } from './helpers/contract';
import { PepemonMatchmaker, PepemonCardDeck, PepemonBattle, PepemonRewardPool } from '../typechain';
import PepemonBattleArtifact from '../artifacts/contracts/PepemonBattle.sol/PepemonBattle.json';
import PepemonCardDeckArtifact from '../artifacts/contracts/PepemonCardDeck.sol/PepemonCardDeck.json';
import PepemonRewardPoolArtifact from '../artifacts/contracts/PepemonRewardPool.sol/PepemonRewardPool.json';

import { expect } from 'chai';
import { deployMockContract, MockContract } from 'ethereum-waffle';
import { BigNumber } from 'ethers';

const [alice, bob, jean, sara] = getWallets();
var c = 0;

describe('::Matchmaker', async () => {
  let matchmaker: PepemonMatchmaker;
  let bobSignedDeck: PepemonMatchmaker;
  let deckMock: PepemonCardDeck | MockContract;
  let battleMock: PepemonBattle | MockContract;
  let rewardMock: PepemonRewardPool | MockContract;

  beforeEach(async () => {
    matchmaker = await deployMatchmakerContract(alice);
    bobSignedDeck = matchmaker.connect(bob);
    deckMock = await deployMockContract(alice, PepemonCardDeckArtifact.abi);
    battleMock = await deployMockContract(alice, PepemonBattleArtifact.abi);
    rewardMock = await deployMockContract(alice, PepemonRewardPoolArtifact.abi);

    await matchmaker.setDeckContractAddress(deckMock.address);
  });

  describe('#Matchmaking', async () => {
    it('Should allow entering for a match', async () => {
      let deckId = 1;
      // mock for the "require" statement
      await deckMock.mock.ownerOf.withArgs(1).returns(alice.address);
      // the version with 3 arguments fails to be mocked for some reason, maybe overloads cant be mocked
      await deckMock.mock.safeTransferFrom.withArgs(alice.address, matchmaker.address, deckId, '0x').returns();
      await matchmaker.enter(deckId);
      expect(await matchmaker.deckOwner(1)).to.eq(alice.address);
      expect(await matchmaker.getWaitingCount()).to.eq(1);
    });

    it('Should allow entering and exiting', async () => {
      let deckId = 1;
      await deckMock.mock.ownerOf.withArgs(1).returns(alice.address);
      await deckMock.mock.safeTransferFrom.withArgs(alice.address, matchmaker.address, deckId, '0x').returns();
      await deckMock.mock.safeTransferFrom.withArgs(matchmaker.address, alice.address, deckId, '0x').returns();
      await matchmaker.enter(deckId);
      await matchmaker.exit(deckId);
      expect(await matchmaker.getWaitingCount()).to.eq(0);
    });
  });
});
