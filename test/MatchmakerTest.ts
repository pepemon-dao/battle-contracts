import { deployMatchmakerContract, getWallets } from './helpers/contract';
import { PepemonMatchmaker, PepemonCardDeck, PepemonBattle, PepemonRewardPool } from '../typechain';
import PepemonBattleArtifact from '../artifacts/contracts/PepemonBattle.sol/PepemonBattle.json';
import PepemonCardDeckArtifact from '../artifacts/contracts/PepemonCardDeck.sol/PepemonCardDeck.json';
import PepemonRewardPoolArtifact from '../artifacts/contracts/PepemonRewardPool.sol/PepemonRewardPool.json';

import { expect } from 'chai';
import { deployMockContract, MockContract, deployContract } from 'ethereum-waffle';
import { BigNumber } from 'ethers';

const [alice, bob] = getWallets();

const aliceDeck = 1;
const bobDeck = 2;
const defaultRanking = 2000;

describe('::Matchmaker', async () => {
  let matchmaker: PepemonMatchmaker;
  let bobSignedMatchmaker: PepemonMatchmaker;
  let cardDeck: PepemonCardDeck | MockContract;
  let battle: PepemonBattle | MockContract;
  let rewardPool: PepemonRewardPool | MockContract;

  beforeEach(async () => {
    matchmaker = await deployMatchmakerContract(alice, defaultRanking);
    bobSignedMatchmaker = matchmaker.connect(bob);
    cardDeck = await deployMockContract(alice, PepemonCardDeckArtifact.abi);
    battle = await deployMockContract(alice, PepemonBattleArtifact.abi);
    rewardPool = await deployMockContract(alice, PepemonRewardPoolArtifact.abi);

    await matchmaker.setDeckContractAddress(cardDeck.address);
    await matchmaker.setBattleContractAddress(battle.address);
    await matchmaker.setRewardPoolAddress(rewardPool.address);

    await cardDeck.mock.balanceOf.withArgs(alice.address).returns(1);
    await cardDeck.mock.balanceOf.withArgs(bob.address).returns(1);
    await setupDecks();
  });

  const setupDecks = async () => {
    // mock deck ownership
    await cardDeck.mock.ownerOf.withArgs(aliceDeck).returns(alice.address);
    await cardDeck.mock.ownerOf.withArgs(bobDeck).returns(bob.address);

    // mock safeTransferFrom from owner to the contract and vice versa
    await cardDeck.mock.safeTransferFrom.withArgs(alice.address, matchmaker.address, aliceDeck, '0x').returns();
    await cardDeck.mock.safeTransferFrom.withArgs(bob.address, matchmaker.address, bobDeck, '0x').returns();

    // safeTransferFrom with 3 arguments fails to be mocked for some reason, maybe overloads cant be mocked
    await cardDeck.mock.safeTransferFrom.withArgs(matchmaker.address, alice.address, aliceDeck, '0x').returns();
    await cardDeck.mock.safeTransferFrom.withArgs(matchmaker.address, bob.address, bobDeck, '0x').returns();
  };

  const getEmptyBattleInstance = async () => {
    // the "Battle" object is huge, this is one way to dynamically get an instance of it since theres no way 
    // to tell TypeScript to create an object based off the type defs from typechain (eg. type a = Parameters<typeof battle.functions.fight>)
    let dummyBattleContract = (await deployContract(alice, PepemonBattleArtifact, [
      alice.address,
      alice.address,
      alice.address,
    ])) as PepemonBattle;
    return await dummyBattleContract.battles(0);
  }

  describe('#Deck', async () => {
    it('Should allow entering and waiting for a match', async () => {
      await matchmaker.enter(aliceDeck);
      expect(await matchmaker.deckOwner(aliceDeck)).to.eq(alice.address);
      expect(await matchmaker.getWaitingCount()).to.eq(1);
    });

    it('Should allow exiting', async () => {
      await matchmaker.enter(aliceDeck);
      await matchmaker.exit(aliceDeck);
      expect(await matchmaker.getWaitingCount()).to.eq(0);
    });
  });

  describe('#Permissions', async () => {
    it('Should prevent anyone but the owner from entering', async () => {
      await expect(bobSignedMatchmaker.enter(aliceDeck)).to.be.revertedWith(
        'PepemonMatchmaker: Not your deck'
      );
    });
    it('Should prevent anyone but the owner from exiting', async () => {
      await matchmaker.enter(aliceDeck);
      await expect(bobSignedMatchmaker.exit(aliceDeck)).to.be.revertedWith(
        'PepemonMatchmaker: Not your deck'
      );
    });
    it('Should prevent anyone but the admins from setting the kFactor', async () => {
      await matchmaker.enter(aliceDeck);
      await expect(bobSignedMatchmaker.setKFactor(34)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });
    it('Should prevent anyone but the admins from changing the default', async () => {
      await matchmaker.enter(aliceDeck);
      await expect(bobSignedMatchmaker.setKFactor(34)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });
  });

  describe('#Ranking', async () => {
    it('Should give higher score for players with lower ranking', async () => {
      // refer to this for the precise values (must set Custom K-factor): https://www.omnicalculator.com/sports/elo
      const playerHiRank = 2300, playerLoRank = 2000;
      let loRankWinScoreChange = await matchmaker.getEloRatingChange(playerLoRank, playerHiRank); // player with lower ranking won
      let hiRankWinScoreChange = await matchmaker.getEloRatingChange(playerHiRank, playerLoRank); // player with higher ranking won
      // Divided by 100 to remove the extra precision from getEloRatingChange
      console.log(`\tloRankWinScoreChange: ${loRankWinScoreChange.toNumber() / 100.0}`);
      console.log(`\thiRankWinScoreChange: ${hiRankWinScoreChange.toNumber() / 100.0}`);
      expect(loRankWinScoreChange.toNumber()).to.be.greaterThan(hiRankWinScoreChange.toNumber());
    });

    it("Should set player's default ranking when they join for the first time", async () => {
      await matchmaker.enter(aliceDeck);
      await matchmaker.exit(aliceDeck); // if bob joins without alice leaving first, a battle would start
      await bobSignedMatchmaker.enter(bobDeck);
      await bobSignedMatchmaker.exit(bobDeck);

      let aliceRanking = await matchmaker.playerRanking(alice.address);
      let bobRanking = await matchmaker.playerRanking(bob.address);

      expect(aliceRanking.toNumber()).to.be.greaterThan(0);
      expect(bobRanking.toNumber()).to.be.greaterThan(0);
    });
  });

  describe('#Battle', async () => {
    it('Should allow a battle between 2 players', async () => {
      // Get an instance of the "Battle" object, which is too big to be created inline
      let emptyBattleData = await getEmptyBattleInstance();
      // Mock battleContract and RewardPool calls
      await battle.mock.createBattle.returns(emptyBattleData, 1);
      await battle.mock.goForBattle.returns(emptyBattleData, alice.address);
      await rewardPool.mock.sendReward.returns();

      await matchmaker.enter(aliceDeck);
      await bobSignedMatchmaker.enter(bobDeck); // battle begins here

      let aliceRanking = await matchmaker.playerRanking(alice.address);
      let bobRanking = await matchmaker.playerRanking(bob.address);
      expect(aliceRanking.toNumber()).to.be.greaterThan(0);
      expect(bobRanking.toNumber()).to.be.greaterThan(0);
    });
  });
});
