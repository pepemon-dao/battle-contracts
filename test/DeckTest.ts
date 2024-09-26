import { deployConfigContract, deployDeckContract, getWallets } from './helpers/contract';
import { PepemonCardDeck, PepemonConfig } from '../typechain';
import { PepemonFactory } from '../typechain';
import { ChainLinkRngOracle } from '../typechain';
import PepemonFactoryArtifact from '../artifacts/contracts-exposed/PepemonFactory.sol/XPepemonFactory.json';
import RNGArtifact from '../artifacts/contracts-exposed/SampleChainLinkRngOracle.sol/XSampleChainLinkRngOracle.json';

import { expect } from 'chai';
import { deployMockContract, MockContract } from 'ethereum-waffle';
import { BigNumber } from 'ethers';

const [alice, bob] = getWallets();

describe('::Deck', async () => {
  let deck: PepemonCardDeck;
  let config: PepemonConfig;
  let bobSignedDeck: PepemonCardDeck;
  let pepemonFactory: PepemonFactory | MockContract;
  let rngOracle: ChainLinkRngOracle | MockContract;

  beforeEach(async () => {
    config = await deployConfigContract(alice);
    deck = await deployDeckContract(alice, config.address);
    bobSignedDeck = deck.connect(bob);
    pepemonFactory = await deployMockContract(alice, PepemonFactoryArtifact.abi);
    rngOracle = await deployMockContract(alice, RNGArtifact.abi);
    await config.setContractAddress("PepemonFactory", pepemonFactory.address, false);
    await deck.syncConfig();

    await pepemonFactory.mock.balanceOf.withArgs(alice.address, 1).returns(1);
    await deck.setRandNrGenContractAddress(rngOracle.address);

    await rngOracle.mock.getRandomNumber.returns(321321231);
  });

  describe('#Deck', async () => {
    it('Should allow a deck to be created', async () => {
      await deck.createDeck();

      await deck.ownerOf(1).then((ownerAddress: string) => {
        expect(ownerAddress).to.eq(alice.address);
      });
    });

    it('Should allow a starter initial deck to be created when there\'s none', async () => {
      await pepemonFactory.mock.batchMintList.returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 3, 1, '0x').returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 21, 1, '0x').returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 20, 1, '0x').returns();
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 3).returns(1);
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 20).returns(5);
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 21).returns(5);

      await deck.setInitialDeckOptions([3,4,5], [20, 21], 5);
      await deck.mintInitialDeck(3);
      await deck.playerToDecks(alice.address, 0).then((deckId: BigNumber) => {
        expect(deckId).to.eq(1);
      });

      await deck.ownerOf(1).then((ownerAddress: string) => {
        expect(ownerAddress).to.eq(alice.address);
      });
    });

    it('Should not allow minting starter deck if the player has one or more decks already', async () => {
      await pepemonFactory.mock.batchMintList.returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 3, 1, '0x').returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 21, 1, '0x').returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 20, 1, '0x').returns();
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 3).returns(1);
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 20).returns(5);
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 21).returns(5);

      await deck.setInitialDeckOptions([3,4,5], [20, 21], 5);

      // create a deck for alice
      await expect(deck.createDeck()).to.not.be.reverted;

      // make sure the deck is there
      expect(await deck.playerToDecks(alice.address, 0)).to.be.eq(1);

      await expect(deck.mintInitialDeck(3)).to.be.revertedWith(
        "Not your first deck"
      );
    });

    it('Should not allow an admin to set unsorted initial deck options', async () => {
      await expect(deck.setInitialDeckOptions([4,3,5], [20, 22, 21], 5)).to.be.reverted;
    });

  });

  describe('#Battle card', async () => {
    beforeEach(async () => {
      await deck.createDeck();
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 1, 1, '0x').returns();
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 1).returns(1);
    });

    it('Should allow adding a Battle Card to the deck', async () => {
      await deck.addBattleCardToDeck(1, 1);
      await deck.decks(1).then((deck: any) => {
        expect(deck['battleCardId']).to.eq(1);
      });
    });

    it('Should return the previous battle card if one has already been supplied', async () => {
      // Mock deposit transfer
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 1, 1, '0x').returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 2, 1, '0x').returns();

      // Mock balance
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 1).returns(1);
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 2).returns(1);

      // Mock withdrawal transfer
      await pepemonFactory.mock.safeTransferFrom.withArgs(deck.address, alice.address, 1, 1, '0x').returns();

      // Add cards
      await deck.addBattleCardToDeck(1, 1);
      await deck.addBattleCardToDeck(1, 2);

      expect(await deck.getBattleCardInDeck(1)).to.eq(2);
    });

    it('Should allow removing a Battle Card from the deck', async () => {
      await pepemonFactory.mock.safeTransferFrom.withArgs(deck.address, alice.address, 1, 1, '0x').returns();

      await deck.addBattleCardToDeck(1, 1);

      await deck.removeBattleCardFromDeck(1);

      await deck.getBattleCardInDeck(1).then((battleCardId: BigNumber) => {
        expect(battleCardId).to.eq(0);
      });
    });

    describe('Permissions', async () => {
      it("Should prevent adding battle cards you don't have", async () => {
        await pepemonFactory.mock.balanceOf.withArgs(alice.address, 1).returns(0);

        await expect(deck.addBattleCardToDeck(1, 1)).to.be.revertedWith(
          "PepemonCardDeck: Don't own battle card"
        );
      });

      it("Should prevent adding a battle card to a deck which you don't own", async () => {
        await pepemonFactory.mock.balanceOf.withArgs(bob.address, 1).returns(1);
        await pepemonFactory.mock.safeTransferFrom.withArgs(bob.address, deck.address, 1, 1, '0x').returns();

        await expect(bobSignedDeck.addBattleCardToDeck(1, 1)).to.be.revertedWith(
          'PepemonCardDeck: Not your deck'
        );
      });

      it("Should prevent removing a battle card from a deck which you don't own", async () => {
        await expect(bobSignedDeck.removeBattleCardFromDeck(1)).to.be.revertedWith(
          'PepemonCardDeck: Not your deck'
        );
      });
    });
  });

  describe('#Support cards', async () => {
    beforeEach(async () => {
      await deck.createDeck();
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 20, 2, '0x').returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 12, 1, '0x').returns();

      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 20).returns(8);
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 12).returns(1);
    });

    it('Should allow support cards to be added to the deck', async () => {
      console.log("0")
      await deck.addSupportCardsToDeck(1, [
        { supportCardId: 20, amount: 2 },
        { supportCardId: 12, amount: 1 },
      ]);
      console.log("1")

      await deck.decks(1).then((deck: any) => {
        expect(deck['supportCardCount']).to.eq(3);
      });
      console.log("2")

      await deck.getCardTypesInDeck(1).then((cardTypes: BigNumber[]) => {
        expect(cardTypes.length).to.eq(2);
        expect(cardTypes[0]).to.eq(20);
        expect(cardTypes[1]).to.eq(12);
      });
      console.log("3")

      expect(await deck.getCountOfCardTypeInDeck(1, 20)).to.eq(2);
      expect(await deck.getCountOfCardTypeInDeck(1, 12)).to.eq(1);
      console.log("4")
    });

    it('Should allow support cards to be removed from the deck', async () => {
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 20).returns(50);
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 12).returns(30);

      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 20, 45, '0x').returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 12, 10, '0x').returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(deck.address, alice.address, 20, 2, '0x').returns();

      await deck.addSupportCardsToDeck(1, [
        { supportCardId: 20, amount: 45 },
        { supportCardId: 12, amount: 10 },
      ]);

      await deck.removeSupportCardsFromDeck(1, [
        {
          supportCardId: 20,
          amount: 2,
        },
      ]);

      await deck.decks(1).then((deck: any) => {
        expect(deck['supportCardCount']).to.eq(53);
      });

      expect(await deck.getCountOfCardTypeInDeck(1, 20)).to.eq(43);
    });

    it('Should allow getting all support cards from deck', async () => {
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 20, 2, '0x').returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 12, 2, '0x').returns();

      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 20).returns(8);
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 12).returns(2);

      await deck.addSupportCardsToDeck(1, [
        { supportCardId: 20, amount: 2 },
        { supportCardId: 12, amount: 2 },
      ]);
      await deck.getAllSupportCardsInDeck(1).then((supportCards: BigNumber[]) => {
        expect(supportCards.length).to.eq(4);

        for (let i = 0; i < supportCards.length; i++) {
          console.log(supportCards[i].toString());
        }
      });
    });

    it('Should consistently add, remove, and retrieve support cards from deck', async () => {
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 29, 1, '0x').returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 30, 1, '0x').returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 31, 1, '0x').returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 32, 1, '0x').returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(deck.address, alice.address, 30, 1, '0x').returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(deck.address, alice.address, 32, 1, '0x').returns();

      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 29).returns(5);
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 30).returns(5);
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 31).returns(5);
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 32).returns(5);

      await deck.addSupportCardsToDeck(1, [
        { supportCardId: 29, amount: 1 },
        { supportCardId: 30, amount: 1 },
        { supportCardId: 31, amount: 1 },
        { supportCardId: 32, amount: 1 },
      ]);

      await deck.removeSupportCardsFromDeck(1, [
        {
          supportCardId: 30,
          amount: 1,
        },
      ]);
      await deck.removeSupportCardsFromDeck(1, [
        {
          supportCardId: 32,
          amount: 1,
        },
      ]);

      await deck.getAllSupportCardsInDeck(1).then((supportCards: BigNumber[]) => {
        expect(supportCards.length).to.eq(2);
        expect(supportCards[0]).to.eq(29);
        expect(supportCards[1]).to.eq(31);
      });
    });

    it('Should shuffle deck in random order', async () => {
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 20).returns(23);
      await pepemonFactory.mock.balanceOf.withArgs(alice.address, 12).returns(15);
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 20, 23, '0x').returns();
      await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 12, 15, '0x').returns();

      await rngOracle.mock.getRandomNumber.withArgs().returns(4000);

      await deck.addSupportCardsToDeck(1, [
        { supportCardId: 20, amount: 23 },
        { supportCardId: 12, amount: 15 },
      ]);

      let deckCards = (await deck.getAllSupportCardsInDeck(1)).map(n => n.toNumber());
      let shuffled = (await deck.shuffleDeck(1, 1)).map(n => n.toNumber());
      expect(deckCards).to.not.eql(shuffled);

      let sortedDeck = [...deckCards].sort();
      let sortedShuffle = [...shuffled].sort();
      expect(sortedDeck).to.eql(sortedShuffle);
    });

    describe('reverts if', async () => {
      it('support card count is lower than 0', async () => {
        await pepemonFactory.mock.balanceOf.withArgs(alice.address, 20).returns(50);
        await pepemonFactory.mock.balanceOf.withArgs(alice.address, 12).returns(30);

        await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 20, 45, '0x').returns();
        await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 12, 10, '0x').returns();
        await pepemonFactory.mock.safeTransferFrom.withArgs(deck.address, alice.address, 20, 30, '0x').returns();

        await deck.addSupportCardsToDeck(1, [
          { supportCardId: 20, amount: 45 },
          { supportCardId: 12, amount: 10 },
        ]);

        await expect(
          deck.removeSupportCardsFromDeck(1, [
            {
              supportCardId: 20,
              amount: 46,
            },
          ])
        ).to.be.reverted;
      });

      it('support card count is greater than max number', async () => {
        await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 20, 20, '0x').returns();
        await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 12, 60, '0x').returns();

        await pepemonFactory.mock.balanceOf.withArgs(alice.address, 20).returns(20);
        await pepemonFactory.mock.balanceOf.withArgs(alice.address, 12).returns(60);

        await expect(
          deck.addSupportCardsToDeck(1, [
            {
              supportCardId: 20,
              amount: 20,
            },
            {
              supportCardId: 12,
              amount: 55,
            },
          ])
        ).to.be.revertedWith('PepemonCardDeck: Deck overflow');
      });
    });

    describe('Permissions', async () => {
      it("Should prevent adding support cards you don't have", async () => {
        await pepemonFactory.mock.balanceOf.withArgs(alice.address, 20).returns(0);

        await expect(deck.addSupportCardsToDeck(1, [{supportCardId: 20, amount: 1}])).to.be.revertedWith(
          "PepemonCardDeck: You don't have enough of this card"
        );
      });

      it("Should prevent adding a support card to a deck which you don't own", async () => {
        await pepemonFactory.mock.balanceOf.withArgs(bob.address, 20).returns(1);
        await pepemonFactory.mock.safeTransferFrom.withArgs(bob.address, deck.address, 20, 1, '0x').returns();

        await expect(bobSignedDeck.addSupportCardsToDeck(1, [{supportCardId: 20, amount: 1}])).to.be.revertedWith(
          'PepemonCardDeck: Not your deck'
        );
      });

      it("Should prevent removing a support card from a deck which you don't own", async () => {
        await pepemonFactory.mock.safeTransferFrom.withArgs(deck.address, bob.address, 20, 1, '0x').returns();
        await pepemonFactory.mock.safeTransferFrom.withArgs(alice.address, deck.address, 20, 1, '0x').returns();

        await deck.addSupportCardsToDeck(1, [{ supportCardId: 20, amount: 1 }]);
        await expect(bobSignedDeck.removeSupportCardsFromDeck(1, [{supportCardId: 20, amount: 1}])).to.be.revertedWith(
          'PepemonCardDeck: Not your deck'
        );
      });
    });
  });

  describe('#Permissions', async () => {
    it('Should prevent anyone but the admins from Syncing the contract config', async () => {
      await expect(bobSignedDeck.syncConfig()).to.be.reverted;
    });
    it('Should prevent anyone but the admins from setting initial deck options', async () => {
      await expect(bobSignedDeck.setInitialDeckOptions([3,4,5], [20, 21, 22], 5)).to.be.reverted;
    });
    it('Should prevent anyone but the admins from changing the Config contract address', async () => {
      await expect(bobSignedDeck.setConfigAddress(bobSignedDeck.address)).to.be.reverted;
    });
    it('Should prevent anyone but the admins from setting MAX_SUPPORT_CARDS', async () => {
      await expect(bobSignedDeck.setMaxSupportCards(1)).to.be.reverted;
    });

    it('Should prevent anyone but the admins from setting MIN_SUPPORT_CARDS', async () => {
      await expect(bobSignedDeck.setMinSupportCards(1)).to.be.reverted;
    });

    it('Should prevent anyone but the admins from setting the RandNrGen contract address', async () => {
      await expect(bobSignedDeck.setRandNrGenContractAddress("0x0000000000000000000000000000000000000000")).to.be.reverted;
    });

    it('Should prevent anyone but the admins from setting the allowed minting cards', async () => {
      await expect(bobSignedDeck.setMintingCards(0, 1)).to.be.reverted;
    });
  });
});
