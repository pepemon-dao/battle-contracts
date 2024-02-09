import { deployMatchmakerContract, getWallets } from './helpers/contract';
import { PepemonMatchmaker, PepemonCardDeck, PepemonBattle, PepemonRewardPool } from '../typechain';
import PepemonBattleArtifact from '../artifacts/contracts-exposed/PepemonBattle.sol/XPepemonBattle.json';
import PepemonCardDeckArtifact from '../artifacts/contracts-exposed/PepemonCardDeck.sol/XPepemonCardDeck.json';
import PepemonRewardPoolArtifact from '../artifacts/contracts-exposed/PepemonRewardPool.sol/XPepemonRewardPool.json';

import PepemonCardOracleArtifact from '../artifacts/contracts-exposed/PepemonCardOracle.sol/XPepemonCardOracle.json';
import RNGArtifact from '../artifacts/contracts-exposed/SampleChainLinkRngOracle.sol/XSampleChainLinkRngOracle.json';


import { expect } from 'chai';
import { deployMockContract, MockContract, deployContract } from 'ethereum-waffle';
import { ethers } from 'hardhat';

const [alice, bob] = getWallets();

let cachedDummyBattleInstance: any = undefined;

const aliceDeck = 1;
const bobDeck = 2;
const defaultRanking = 2000;

describe('::Matchmaker', () => {
  let matchmaker: PepemonMatchmaker;
  let bobSignedMatchmaker: PepemonMatchmaker;
  let cardDeck: PepemonCardDeck | MockContract;
  let battle: PepemonBattle | MockContract;
  let rewardPool: PepemonRewardPool | MockContract;

  beforeEach(async () => {
    cardDeck = await deployMockContract(alice, PepemonCardDeckArtifact.abi);
    battle = await deployMockContract(alice, PepemonBattleArtifact.abi);
    rewardPool = await deployMockContract(alice, PepemonRewardPoolArtifact.abi);
    matchmaker = await deployMatchmakerContract(alice, defaultRanking, battle.address, cardDeck.address, rewardPool.address);
    bobSignedMatchmaker = matchmaker.connect(bob);

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
    
    // no args specified => any params apply the specified return
    await cardDeck.mock.MIN_SUPPORT_CARDS.returns(0);
    await cardDeck.mock.decks.returns(1, 1);
    await cardDeck.mock.getBattleCardInDeck.returns(1);
  };

  const incrementBlockTimestamp = async (addedSecs: number) => {
      // https://ethereum.stackexchange.com/questions/86633/time-dependent-tests-with-hardhat https://tinyurl.com/2yuf32vd
      await ethers.provider.send("evm_increaseTime", [addedSecs]);
      // @ts-ignore
      await ethers.provider.send("evm_mine");
  };

  const getDummyBattleInstance = async () => {
    if (cachedDummyBattleInstance) {
      return cachedDummyBattleInstance;
    }
    // the "Battle" object is huge, this is one way to dynamically get an instance of it since theres no way 
    // to tell TypeScript to create an object based off the type defs from typechain (eg. type a = Parameters<typeof battle.functions.fight>)

    let cardContract = await deployMockContract(alice, PepemonCardOracleArtifact.abi);
    let rng = await deployMockContract(alice, RNGArtifact.abi);
    
    await rng.mock.getRandomNumber.returns(0);
    await cardContract.mock.getBattleCardById.returns([0,0,0,0,0,0,0,0,0,]);
    await cardDeck.mock.decks.returns(0, 0);

    let dummyBattleContract = (await deployContract(alice, PepemonBattleArtifact, [
      cardContract.address,
      cardDeck.address,
      rng.address,
    ])) as PepemonBattle;

    cachedDummyBattleInstance = (await dummyBattleContract.callStatic.createBattle(alice.address, 1, bob.address, 2))[0];
    return cachedDummyBattleInstance;
  }

  const forceDiversifyRankings = async (KFactor=4000) => {
    // some tests requires at least 2 different players waiting for a match, but since we cannot
    // change the ranking manually in the contract, we need to make a battle happen to update the
    // ranking first, this function does that by forcing alice to win against bob with an absurd KFactor
    
    // Note: this function might fail if battles are not working, tests relying on this will also fail

    // Get an instance of the "Battle" object, which is too big to be created inline
    let emptyBattleData = await getDummyBattleInstance();

    // Mock battleContract and RewardPool calls
    await rewardPool.mock.sendReward.returns();
    await battle.mock.createBattle.returns(emptyBattleData, 1);
    await battle.mock.goForBattle.returns(emptyBattleData, alice.address); // alice will win

    // set an absurd K-factor so that Bob loses 2000 points in the ranking, because we cant set rankings manually.
    await matchmaker.setKFactor(KFactor);
    
    await matchmaker.enter(aliceDeck);
    await bobSignedMatchmaker.enter(bobDeck); // battle begins here. bob loses 2000 rating points (if KFactor is 4000)
    await matchmaker.setKFactor(16);
  }

  describe('#Deck', () => {
    it('Should allow entering and waiting for a match', async () => {
      await matchmaker.enter(aliceDeck);
      expect(await matchmaker.deckOwner(aliceDeck)).to.eq(alice.address);
      expect(await matchmaker.getWaitingCount()).to.eq(1);
    });

    it('Should disallow entering without the minimum amount of support cards', async () => {
      await cardDeck.mock.decks.returns(0,0);
      await cardDeck.mock.MIN_SUPPORT_CARDS.withArgs().returns(100);

      await expect(matchmaker.enter(aliceDeck)).to.be.revertedWith(
        'PepemonMatchmaker: Not enough support cards'
      );
    });

    it('Should disallow entering without a battle card', async () => {
      await cardDeck.mock.decks.returns(0,0);
      await cardDeck.mock.getBattleCardInDeck.returns(0);

      await expect(matchmaker.enter(aliceDeck)).to.be.revertedWith(
        'PepemonMatchmaker: Invalid battlecard'
      );
    });

    it('Should allow exiting', async () => {
      await matchmaker.enter(aliceDeck);
      await matchmaker.exit(aliceDeck);
      expect(await matchmaker.getWaitingCount()).to.eq(0);
    });

    it('Should allow multiple players to enter and exit consistently', async () => {
      await forceDiversifyRankings(5000);

      await matchmaker.enter(aliceDeck);
      await bobSignedMatchmaker.enter(bobDeck);
      await matchmaker.exit(aliceDeck);
      await bobSignedMatchmaker.exit(bobDeck);
      expect(await matchmaker.getWaitingCount()).to.eq(0);
    });
  });

  describe('#Permissions', () => {
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
      await expect(bobSignedMatchmaker.setKFactor(34)).to.be.reverted;
    });
    it('Should prevent anyone but the admins from changing the MatchRange', async () => {
      await matchmaker.enter(aliceDeck);
      await expect(bobSignedMatchmaker.setMatchRange(34, 68)).to.be.reverted;
    });
    it('Should prevent anyone but the admins from forcibly removing a deck from the waitlist', async () => {
      await matchmaker.enter(aliceDeck);
      await expect(bobSignedMatchmaker.forceExit(1)).to.be.reverted;
    });
    it('Should allow admins to forcibly remove a deck from the waitlist', async () => {
      await bobSignedMatchmaker.enter(bobDeck);
      expect(await matchmaker.getWaitingCount()).to.eq(1);
      await expect(matchmaker.forceExit(bobDeck)).to.not.be.reverted;
      expect(await matchmaker.getWaitingCount()).to.eq(0);
    });
    it('Should prevent anyone from adding PvE decks when PvE mode is disabled', async () => {
      await expect(matchmaker.addPveDeck(aliceDeck)).to.be.reverted;
      await expect(bobSignedMatchmaker.addPveDeck(bobDeck)).to.be.reverted;
    });
    it('Should prevent anyone from removing PvE decks when PvE mode is disabled', async () => {
      await expect(matchmaker.removePveDeck(aliceDeck)).to.be.reverted;
      await expect(bobSignedMatchmaker.removePveDeck(bobDeck)).to.be.reverted;
    });
    it('Should prevent anyone but the admins from setting PvE mode', async () => {
      await expect(matchmaker.setPveMode(true)).not.to.be.reverted;
      await expect(bobSignedMatchmaker.setPveMode(false)).to.be.reverted;
    });
    it('Should prevent anyone but the admins from adding a PvE deck', async () => {
      await matchmaker.setPveMode(true);
      await expect(matchmaker.addPveDeck(aliceDeck)).not.to.be.reverted;
      await expect(bobSignedMatchmaker.addPveDeck(bobDeck)).to.be.reverted;
    });
    it('Should prevent anyone but the admins from removing a PvE deck', async () => {
      await matchmaker.setPveMode(true);
      await matchmaker.addPveDeck(aliceDeck);
      expect(await matchmaker.getWaitingCount()).to.eq(1);
      await expect(bobSignedMatchmaker.removePveDeck(aliceDeck)).to.be.reverted;
    });
    it('Should prevent players from entering a PvE match with PvP mode enabled', async () => {
      await matchmaker.setPveMode(false);
      await expect(bobSignedMatchmaker.enterPve(bobDeck)).to.be.revertedWith(
        "PepemonMatchmaker: PvE mode disabled"
      );
    });
    it('Should prevent players from entering a PvP match with PvE mode enabled', async () => {
      await matchmaker.setPveMode(true);
      await expect(bobSignedMatchmaker.enter(bobDeck)).to.be.revertedWith(
        "PepemonMatchmaker: PvE mode enabled"
      );
    });
    it('Should prevent players from entering a PvE match when there are no opponents set by admins', async () => {
      await matchmaker.setPveMode(true);
      await expect(bobSignedMatchmaker.enterPve(bobDeck)).to.be.revertedWith(
        "PepemonMatchmaker: No PvE opponents available"
      );
    });
  });

  describe('#Ranking', () => {
    it('Should calculate Elo rating change correctly', async () => {
      // refer to this for the precise values (must set Custom K-factor): https://www.omnicalculator.com/sports/elo
      await matchmaker.setKFactor(16);
      // Divided by 100 to remove the extra precision from getEloRatingChange
      let scoreChange = (await matchmaker.getEloRatingChange(2000, 2000)).toNumber() / 100;
      //console.log(`\tScore change: ${scoreChange}`);
      expect(scoreChange).to.be.equal(8);
    });

    it('Should give higher score for players with lower ranking', async () => {
      const playerHiRank = 2300, playerLoRank = 2000;
      let loRankWinScoreChange = await matchmaker.getEloRatingChange(playerLoRank, playerHiRank); // player with lower ranking won
      let hiRankWinScoreChange = await matchmaker.getEloRatingChange(playerHiRank, playerLoRank); // player with higher ranking won
      //console.log(`\tloRankWinScoreChange: ${loRankWinScoreChange.toNumber() / 100.0}`);
      //console.log(`\thiRankWinScoreChange: ${hiRankWinScoreChange.toNumber() / 100.0}`);
      expect(loRankWinScoreChange.toNumber()).to.be.greaterThan(hiRankWinScoreChange.toNumber());
    });

    it("Should set player's default ranking when they join for the first time", async () => {
      await matchmaker.enter(aliceDeck);
      await matchmaker.exit(aliceDeck); // if bob joins without alice leaving first, a battle would start
      await bobSignedMatchmaker.enter(bobDeck);
      await bobSignedMatchmaker.exit(bobDeck);

      let aliceRanking = await matchmaker.playerRanking(alice.address);
      let bobRanking = await matchmaker.playerRanking(bob.address);

      expect(aliceRanking.toNumber()).to.be.equal(defaultRanking);
      expect(bobRanking.toNumber()).to.be.equal(defaultRanking);
    });

    it('Should return the player rankings correctly', async () => {
      await matchmaker.enter(aliceDeck);
      await matchmaker.exit(aliceDeck); // if bob joins without alice leaving first, a battle would start
      await bobSignedMatchmaker.enter(bobDeck);
      await bobSignedMatchmaker.exit(bobDeck);

      let rankings = await matchmaker.getPlayersRankings(1, 0);
      // expect: [[alice_address], [alice_ranking]]
      expect(rankings.length).to.be.eq(2);
      expect(rankings[0].length).to.be.eq(1);
      expect(rankings[0][0]).to.be.eq(alice.address);
      
      rankings = await matchmaker.getPlayersRankings(5, 0);
      // expect: [[alice_address, bob_address], [alice_ranking, bob_ranking]]
      expect(rankings.length).to.be.eq(2);
      expect(rankings[0].length).to.be.eq(2);
      expect(rankings[0][1]).to.be.eq(bob.address);
      
      rankings = await matchmaker.getPlayersRankings(1, 1);
      // expect: [[bob_address], [bob_ranking]]
      expect(rankings.length).to.be.eq(2);
      expect(rankings[0].length).to.be.eq(1);
      expect(rankings[0][0]).to.be.eq(bob.address);
    });

    it('Should prevent rankings from resetting when going to 0', async () => {
      await forceDiversifyRankings()

      await matchmaker.enter(aliceDeck);
      await bobSignedMatchmaker.enter(bobDeck); // battle begins here. bob loses 2000 rating points

      let bobRanking = await matchmaker.playerRanking(bob.address);
      expect(bobRanking.toNumber()).to.be.equal(1);
    });

    it('Should prevent rankings from going below 0', async () => {
      await forceDiversifyRankings(4200)

      let bobRanking = await matchmaker.playerRanking(bob.address);
      expect(bobRanking.toNumber()).to.be.equal(1);
    });
  });

  describe('#Battle', () => {
    it('Should allow a battle between 2 players to update their ranking', async () => {
      // Get an instance of the "Battle" object, which is too big to be created inline
      let emptyBattleData = await getDummyBattleInstance();
      // Mock battleContract and RewardPool calls
      await battle.mock.createBattle.returns(emptyBattleData, 1);
      await battle.mock.goForBattle.returns(emptyBattleData, alice.address); // alice wins
      await rewardPool.mock.sendReward.returns();

      await matchmaker.enter(aliceDeck);
      await bobSignedMatchmaker.enter(bobDeck); // battle begins here

      let aliceRanking = await bobSignedMatchmaker.playerRanking(alice.address);
      let bobRanking = await bobSignedMatchmaker.playerRanking(bob.address);
      expect(aliceRanking.toNumber()).to.be.greaterThan(bobRanking.toNumber());
    });

    it('Should allow a battle between players with large ranking difference after waiting some time', async () => {
      // make Bob lose 500 points in the ranking, because we cant set rankings manually.
      await forceDiversifyRankings(1000);

      // put alice in the waitlist.
      await matchmaker.enter(aliceDeck);

      await matchmaker.setMatchRange(300, 1); // 1 per min

      // change the time.
      await incrementBlockTimestamp(50*60) // 50min. after this, the block will have 00h50m00s as its timestamp

      // after 50min, matchrange will be 350 (1*50+300). not enough for bob to match with alice this time.
      let opponent = await bobSignedMatchmaker.xfindMatchmakingOpponent(bobDeck); // hardhat-exposed
      expect(opponent.toNumber()).to.be.equal(0);

      await matchmaker.setMatchRange(300, 12); // 12 per min

      // change the time again.
      await incrementBlockTimestamp(8*60 + 30) // 8min and 30 seconds. after this, the block will have 00h58m30s as its timestamp

      // after 8min and 30 seconds, matchrange will be 1002 (12*58.5+300). enough for bob to match with alice.
      // without the extra precision in findMatchmakingOpponent the match range would be 996 (12*58+300) and fail;
      opponent = await bobSignedMatchmaker.xfindMatchmakingOpponent(bobDeck);
      expect(opponent.toNumber()).to.be.equal(aliceDeck);
    });

    it('Should not revert after waiting a lot of time', async () => {
      // make Bob lose 2000 points in the ranking, because we cant set rankings manually.
      //await forceDiversifyRankings();

      // put alice in the waitlist.
      await matchmaker.enter(aliceDeck);

      await matchmaker.setMatchRange(1000, 500); // 100 per min

      // change the time.
      await incrementBlockTimestamp(10*60) // 10min. after this, the block will have +00h10m00s as its timestamp

      // after 10min, matchrange will be 6000 (500*10+1000).
      // when calculating the player ranking difference the matchRange parameter will be bigger than the player ranking
      // so it will become a negative number and an integer underflow could happen
      await expect(bobSignedMatchmaker.xfindMatchmakingOpponent(bobDeck)).not.to.be.reverted;
    });

    it('Should prevent a battle between players with large ranking difference if matchRangePerMinute is zero', async () => {
      // Get an instance of the "Battle" object, which is too big to be created inline
      let emptyBattleData = await getDummyBattleInstance();

      // Mock battleContract and RewardPool calls
      await battle.mock.createBattle.returns(emptyBattleData, 1);
      await rewardPool.mock.sendReward.returns();

      // set an absurd K-factor so that Bob loses 500 points in the ranking, because we cant set rankings manually.
      await matchmaker.setKFactor(1000);
      await battle.mock.goForBattle.returns(emptyBattleData, alice.address); // alice will win
      await matchmaker.enter(aliceDeck);
      await bobSignedMatchmaker.enter(bobDeck); // battle begins here. bob loses 500 rating points

      await matchmaker.setMatchRange(300, 0); // disable matchRangePerMinute

      // change the time.
      await incrementBlockTimestamp(4*60*60) // 4 hours. after this, the block will have 04h00m00s as its timestamp

      let opponent = await bobSignedMatchmaker.xfindMatchmakingOpponent(bobDeck); // hardhat-exposed
      expect(opponent.toNumber()).to.be.equal(0);
    });

    it('Should allow two players to fight in PvE', async () => {
      // Get an instance of the "Battle" object, which is too big to be created inline
      let emptyBattleData = await getDummyBattleInstance();
      // Mock battleContract and RewardPool calls
      await battle.mock.createBattle.returns(emptyBattleData, 1);
      await battle.mock.goForBattle.returns(emptyBattleData, alice.address); // alice wins
      await rewardPool.mock.sendReward.returns();

      // enable PvE mode
      await matchmaker.setPveMode(true);
      await matchmaker.addPveDeck(aliceDeck);

      // battle 3x in a row
      await bobSignedMatchmaker.enterPve(bobDeck); 
      await bobSignedMatchmaker.enterPve(bobDeck);
      await bobSignedMatchmaker.enterPve(bobDeck);

      let aliceRanking = await bobSignedMatchmaker.playerRanking(alice.address);
      let bobRanking = await bobSignedMatchmaker.playerRanking(bob.address);
      expect(aliceRanking.toNumber()).to.be.greaterThan(bobRanking.toNumber());
    });
  });
});
