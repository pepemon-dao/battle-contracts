import { BigNumberish } from 'ethers';
import { BATTLECARDS, SUPPORTCARDS } from '../deploy/cards';
import { PEPEMON_FACTORY, PEPEMON_DECK, PEPEMON_MATCHMAKER } from '../deploy/constants';
import { PepemonCardDeck, PepemonFactory, PepemonMatchmaker } from '../typechain';

import hre from 'hardhat';

type AddSupportCardList = {
  supportCardId: BigNumberish;
  amount: BigNumberish;
}[];

async function getContract(contract: string): Promise<any> {
  let deployment = await hre.deployments.get(contract);
  return await hre.ethers.getContractAt(contract, deployment.address);
}

function rand(max: number): number {
  return Math.floor(Math.random() * max);
}

describe('Integration Tests', async () => {
  await hre.ethers.provider.send("evm_setIntervalMining", [0]);
  let selfAddress = await hre.ethers.provider.getSigner().getAddress();
  let pepemonMatchmaker: PepemonMatchmaker = await getContract(PEPEMON_MATCHMAKER);
  let pepemonFactory: PepemonFactory = await getContract(PEPEMON_FACTORY);
  let pepemonDeck: PepemonCardDeck = await getContract(PEPEMON_DECK);

  before(async () => {
    await pepemonFactory.setApprovalForAll(pepemonDeck.address, true);
    await pepemonDeck.setApprovalForAll(pepemonMatchmaker.address, true);
  });

  async function mintRandomDeck() {
    // Choose a random battle card
    let battleCardIdx = rand(BATTLECARDS.length);
    let battleCardId = 1 + battleCardIdx;
    let battleCard = BATTLECARDS[battleCardIdx]

    // Choose 20 random support cards
    let supportCardCount = 1 + rand(50);
    let supportCardIdxs = Array.from(Array(supportCardCount).keys()).map(_ => rand(SUPPORTCARDS.length));
    let supportCardIds = supportCardIdxs.map(idx => BATTLECARDS.length + idx + 1);
    let supportCards = supportCardIdxs.map(idx => SUPPORTCARDS[idx]);

    await pepemonDeck.createDeck();
    let deckCount = await pepemonDeck.getDeckCount(selfAddress);
    let deckIndex = deckCount.sub(1);
    let deckId = await pepemonDeck.playerToDecks(selfAddress, deckIndex);
    console.log("Created deck " + deckId);

    const supportCardsToAdd: AddSupportCardList = Object.values(supportCardIds.reduce((acc: any, val: number) => {
      acc[val] = acc[val] || { supportCardId: val, amount: 0 };
      acc[val].amount++;
      return acc;
    }, {}));

    const maxCardCount = supportCardsToAdd.reduce((max, item) => Math.max(max, item.amount as number), 0);

    console.log("Adding " + (1 + supportCardIds.length) + " cards to deck " + deckId);

    // Queue txs
    await hre.ethers.provider.send("evm_setAutomine", [false]);

    // Mint required number of cards
    for (let i = 0; i < maxCardCount; i++) {
      await pepemonDeck.mintCards();
    }

    // Add to deck
    await pepemonDeck.addBattleCardToDeck(deckId, battleCardId);
    await pepemonDeck.addSupportCardsToDeck(deckId, supportCardsToAdd);

    // Mine queued txs
    await hre.ethers.provider.send("hardhat_mine", ["0x10"]);
    await hre.ethers.provider.send("evm_setAutomine", [true]);

    console.log("Deck Cards: " + battleCardId + ", [" + supportCardIds + "]");
    return deckId;
  }

  async function mintDeck(battleCardId: number, supportCardIds: number[]) {
    await pepemonDeck.createDeck();
    let deckCount = await pepemonDeck.getDeckCount(selfAddress);
    let deckIndex = deckCount.sub(1);
    let deckId = await pepemonDeck.playerToDecks(selfAddress, deckIndex);
    console.log("Created deck " + deckId);

    const supportCardsToAdd: AddSupportCardList = Object.values(supportCardIds.reduce((acc: any, val: number) => {
      acc[val] = acc[val] || { supportCardId: val, amount: 0 };
      acc[val].amount++;
      return acc;
    }, {}));

    const maxCardCount = supportCardsToAdd.reduce((max, item) => Math.max(max, item.amount as number), 0);

    console.log("Adding " + (1 + supportCardIds.length) + " cards to deck " + deckId);

    // Queue txs
    await hre.ethers.provider.send("evm_setAutomine", [false]);

    // Mint required number of cards
    for (let i = 0; i < maxCardCount; i++) {
      await pepemonDeck.mintCards();
    }

    // Add to deck
    await pepemonDeck.addBattleCardToDeck(deckId, battleCardId);
    await pepemonDeck.addSupportCardsToDeck(deckId, supportCardsToAdd);

    // Mine queued txs
    await hre.ethers.provider.send("hardhat_mine", ["0x10"]);
    await hre.ethers.provider.send("evm_setAutomine", [true]);

    console.log("Cards: " + battleCardId + " " + supportCardIds);
    return deckId;
  }

  describe('Reproduce Problematic Battles', async() => {
    it("Battle Scenario 1 (slow)", async() => {
      let deck1 = await mintDeck(2, [29,28,36,22,30,31,37,14,31,16,41,18,48,32,18,11,24,20,16,47,43,47,39,23]);
      let deck2 = await mintDeck(10, [22,14,33,18,25,40,48,16,39,49,12,33,46,39,36,24,45,31,35,38,38,44,42,26,40,11,31,17,22,19,13,17,43,21]);

      console.log("Battling decks " + deck1 + " and " + deck2);
      let d0 = Date.now();
      await pepemonMatchmaker.enter(deck1);
      let d1 = Date.now();
      await pepemonMatchmaker.enter(deck2);
      let d2 = Date.now();
      console.log("Enter duration: " + (d1 - d0) + "ms");
      console.log("Battle duration: " + (d2 - d1) + "ms");
    });
    it("Battle Scenario 2 (slow)", async() => {
      let deck1 = await mintDeck(9, [11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,36,37,38,39]);
      let deck2 = await mintDeck(9, [27,27,28,28,28,29,29,30,30,31,31,32,33,34,35,40,40]);

      console.log("Battling decks " + deck1 + " and " + deck2);
      let d0 = Date.now();
      await pepemonMatchmaker.enter(deck1);
      let d1 = Date.now();
      await pepemonMatchmaker.enter(deck2);
      let d2 = Date.now();
      console.log("Enter duration: " + (d1 - d0) + "ms");
      console.log("Battle duration: " + (d2 - d1) + "ms");
    });
    it("Battle Scenario 3 (fast)", async() => {
      let deck1 = await mintDeck(7, [38,35,19,30,12,42,35,28,32,41,38,16,35,21,14,29,11,47,38,34,25,23,20,19,25,36,27,27,49,40,41,15,37,37,14,44]);
      let deck2 = await mintDeck(7, [21,17,26]);

      console.log("Battling decks " + deck1 + " and " + deck2);
      let d0 = Date.now();
      await pepemonMatchmaker.enter(deck1);
      let d1 = Date.now();
      await pepemonMatchmaker.enter(deck2);
      let d2 = Date.now();
      console.log("Enter duration: " + (d1 - d0) + "ms");
      console.log("Battle duration: " + (d2 - d1) + "ms");
    });
  });

  describe('10 Random Battles', async () => {
    for (let n = 0; n < 20; n++) {
      it("Battle " + n, async () => {
        let deck1 = await mintRandomDeck();
        let deck2 = await mintRandomDeck();

        console.log("Battling decks " + deck1 + " and " + deck2);
        await pepemonMatchmaker.enter(deck1);
        let d1 = Date.now();
        await pepemonMatchmaker.enter(deck2);
        let d2 = Date.now();
        console.log("Battle duration: " + (d2 - d1) + "ms");
      });
    }
  });
});
