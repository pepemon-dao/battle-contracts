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

  // describe('Reproduce Problematic Battle', async() => {
  //   it("Battles", async() => {
  //     // Created deck 7
  //     // Adding 30 cards to deck 7
  //     // Cards: 7 47,48,13,18,45,13,22,49,18,11,30,24,38,40,38,19,35,43,25,39,30,17,24,30,31,20,14,46,49
  //     // Created deck 8
  //     // Adding 25 cards to deck 8
  //     // Cards: 1 13,49,41,46,38,46,46,25,30,30,38,13,40,14,33,39,23,16,41,16,40,26,20,37
  //     // Battling decks 7 and 8
  //     let deck1 = await mintDeck(7, [47,48,13,18,45,13,22,49,18,11,30,24,38,40,38,19,35,43,25,39,30,17,24,30,31,20,14,46,49]);
  //     let deck2 = await mintDeck(1, [13,49,41,46,38,46,46,25,30,30,38,13,40,14,33,39,23,16,41,16,40,26,20,37]);
      
  //     console.log("Battling decks " + deck1 + " and " + deck2);
  //     await pepemonMatchmaker.enter(deck1);
  //     await pepemonMatchmaker.enter(deck2);
  //   });
  // });

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
