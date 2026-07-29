import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber, Contract } from 'ethers';

/**
 * These tests deploy real PepemonFactory and PepemonCardDeck contracts and drive the booster
 * through them. Nothing here is mocked: a pack really calls the deck's mintCards() faucet, the
 * factory really mints 49 ERC1155 ids into the booster, and the booster really transfers cards
 * out to the buyer.
 *
 * Forking Base Sepolia would be better still, but hardhat 2.14 cannot fork OP-stack chains --
 * it requires totalDifficulty in the block response and no public Base RPC returns it. Bumping
 * hardhat needs --force against the repo's peer dependencies, which is its own change. The
 * live-deployment half of the verification was therefore done out of band with eth_call against
 * Base Sepolia, which confirmed that mintCards() succeeds from an arbitrary caller and that
 * batchMintList reverts with panic 0x32 on every call.
 *
 * That last point is why this contract sources cards the way it does, and why it is worth
 * saying plainly: the design this replaces was built on PepemonCardDeck.mintInitialDeck, which
 * reads fine in source but is dead on the live deployment three separate ways. Tests against
 * mocks would have reproduced the source, passed, and taught us nothing.
 */

const CARD_COUNT = 49;
const MAX_SUPPLY = 99999999;

// Card ids grouped by the rarity recorded in deploy/cards.ts. Battle cards are ids 1-10 and are
// all Common, so they get their own pool rather than being mixed into the common one.
const BATTLE_POOL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const COMMON_POOL = [11, 12, 13, 14, 15, 16, 17, 27, 28, 29];
const RARE_POOL = [18, 19, 20, 21, 22, 25, 30, 31, 32, 33, 34, 36, 37, 40, 41, 42, 43, 44, 46, 47, 48];
const EPIC_POOL = [23, 24, 26, 35, 38, 39, 45, 49];

const TIERS = {
  starter: { id: 1, price: ethers.utils.parseEther('0.0001'), battle: 0, common: 4, rare: 1, epic: 0 },
  trainer: { id: 2, price: ethers.utils.parseEther('0.0003'), battle: 1, common: 5, rare: 3, epic: 1 },
  degen: { id: 3, price: ethers.utils.parseEther('0.001'), battle: 2, common: 8, rare: 7, epic: 3 },
};

describe('::BoosterPack', () => {
  let booster: Contract;
  let factory: Contract;
  let deck: Contract;
  let admin: any;
  let buyer: any;

  beforeEach(async function () {
    this.timeout(180000);
    [admin, buyer] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory('XPepemonFactory');
    factory = await Factory.deploy();
    await factory.deployed();

    // Cards must exist before they can be minted: mintPepe checks tokenMaxSupply. xcreate is
    // the internal create() surfaced by hardhat-exposed; the lowercase prefix comes from
    // hardhat.config.tests.ts, which is the config `make test` and CI both use.
    for (let i = 0; i < CARD_COUNT; i++) {
      await factory.xcreate(MAX_SUPPLY, 0, '', '0x');
    }

    const Config = await ethers.getContractFactory('PepemonConfig');
    const config = await Config.deploy();
    await config.deployed();

    const Deck = await ethers.getContractFactory('PepemonCardDeck');
    deck = await Deck.deploy(config.address);
    await deck.deployed();

    await config.setContractAddress('PepemonFactory', factory.address, false);
    await deck.syncConfig();

    // Mirrors deploy/005_contract_config.ts, which is what the live deployment ran.
    await factory.addMinter(deck.address);
    await deck.setMintingCards(1, CARD_COUNT);

    const BoosterPack = await ethers.getContractFactory('PepemonBoosterPack');
    booster = await BoosterPack.deploy(factory.address, deck.address);
    await booster.deployed();

    await booster.setPools(BATTLE_POOL, COMMON_POOL, RARE_POOL, EPIC_POOL);
    for (const tier of Object.values(TIERS)) {
      await booster.setTier(tier.id, tier.price, tier.battle, tier.common, tier.rare, tier.epic, true);
    }
  });

  // Pack gas is data-dependent, and the seed moves between estimation and execution, so a bare
  // estimate is sometimes short. Ethers v5 adds no buffer of its own. The client sends with the
  // same headroom, so the tests buy the way the game does.
  const GAS_LIMIT = 6000000;

  /** Buys a pack and reads the awarded card ids straight off the PackOpened event. */
  async function openPack(tier: { id: number; price: BigNumber }, signer = buyer): Promise<number[]> {
    const tx = await booster.connect(signer).mintPack(tier.id, { value: tier.price, gasLimit: GAS_LIMIT });
    const receipt = await tx.wait();
    const event = receipt.events.find((e: any) => e.event === 'PackOpened');
    expect(event, 'PackOpened was not emitted').to.not.be.undefined;
    return event.args.cardIds.map((id: BigNumber) => id.toNumber());
  }

  describe('pack contents', () => {
    it('delivers a starter pack of the advertised size and rarity mix', async () => {
      const cards = await openPack(TIERS.starter);

      expect(cards.length).to.eq(5);
      expect(cards.filter((id) => COMMON_POOL.includes(id)).length).to.eq(4);
      expect(cards.filter((id) => RARE_POOL.includes(id)).length).to.eq(1);
    });

    it('delivers a trainer pack including a Pepemon and an Epic', async () => {
      const cards = await openPack(TIERS.trainer);

      expect(cards.length).to.eq(10);
      expect(cards.filter((id) => BATTLE_POOL.includes(id)).length).to.eq(1);
      expect(cards.filter((id) => COMMON_POOL.includes(id)).length).to.eq(5);
      expect(cards.filter((id) => RARE_POOL.includes(id)).length).to.eq(3);
      expect(cards.filter((id) => EPIC_POOL.includes(id)).length).to.eq(1);
    });

    it('delivers a degen pack of 20 cards', async () => {
      const cards = await openPack(TIERS.degen);

      expect(cards.length).to.eq(20);
      expect(cards.filter((id) => BATTLE_POOL.includes(id)).length).to.eq(2);
      expect(cards.filter((id) => COMMON_POOL.includes(id)).length).to.eq(8);
      expect(cards.filter((id) => RARE_POOL.includes(id)).length).to.eq(7);
      expect(cards.filter((id) => EPIC_POOL.includes(id)).length).to.eq(3);
    });

    it('never puts the same card in a pack twice', async () => {
      const cards = await openPack(TIERS.degen);
      expect(new Set(cards).size).to.eq(cards.length);
    });

    it('only ever awards ids that are in a configured pool', async () => {
      const known = [...BATTLE_POOL, ...COMMON_POOL, ...RARE_POOL, ...EPIC_POOL];
      const cards = await openPack(TIERS.degen);
      expect(cards.every((id) => known.includes(id))).to.eq(true);
    });
  });

  describe('delivery', () => {
    it('transfers the cards to the buyer on the game factory', async () => {
      const ids = [...BATTLE_POOL, ...COMMON_POOL, ...RARE_POOL, ...EPIC_POOL];
      const owners = ids.map(() => buyer.address);
      const before: BigNumber[] = await factory.balanceOfBatch(owners, ids);

      const cards = await openPack(TIERS.trainer);

      const after: BigNumber[] = await factory.balanceOfBatch(owners, ids);
      const gained = ids.filter((id, i) => after[i].gt(before[i]));

      // Every awarded card is a real balance increase, and nothing the pack did not award moved.
      expect(gained.sort((a, b) => a - b)).to.deep.eq([...cards].sort((a, b) => a - b));
    });

    it('gives the buyer exactly one of each awarded card', async () => {
      const cards = await openPack(TIERS.trainer);
      const owners = cards.map(() => buyer.address);
      const balances: BigNumber[] = await factory.balanceOfBatch(owners, cards);

      expect(balances.every((b) => b.eq(1))).to.eq(true);
    });

    it('keeps working across consecutive packs as inventory drains', async function () {
      this.timeout(300000);
      for (let i = 0; i < 5; i++) {
        expect((await openPack(TIERS.degen)).length).to.eq(20);
      }
    });

    it('stays inside the gas headroom the client sends', async function () {
      this.timeout(300000);
      // Regression test. Inventory used to be topped up only when a drawn card was missing,
      // which put a ~1.7M gas swing on the outcome of the roll: a pack estimated against a
      // cheap roll would execute an expensive one and run out of gas, taking the player's money
      // and giving nothing back. Gas is still data-dependent, so what is asserted here is the
      // property the client actually relies on -- that a settled pack fits well inside the
      // limit the game sends -- rather than a constant that would not hold.
      const used: BigNumber[] = [];
      for (let i = 0; i < 5; i++) {
        const tx = await booster.connect(buyer).mintPack(TIERS.degen.id, { value: TIERS.degen.price, gasLimit: GAS_LIMIT });
        used.push((await tx.wait()).gasUsed);
      }

      const max = used.reduce((a, b) => (a.gt(b) ? a : b));
      expect(max.toNumber(), 'a pack must fit inside the gas limit the client sends').to.be.lessThan(GAS_LIMIT);

      // The first pack writes 49 cold storage slots and is by far the most expensive; later
      // packs settle. If the settled cost ever approached the limit, the client's headroom
      // would need revisiting rather than this number quietly being raised.
      const settled = used.slice(1).reduce((a, b) => (a.gt(b) ? a : b));
      expect(settled.toNumber(), 'settled pack cost drifted; revisit the client gas limit').to.be.lessThan(2500000);
    });

    it('rolls a different pack each time', async () => {
      const first = await openPack(TIERS.degen);
      const second = await openPack(TIERS.degen);

      // Same tier, same buyer, back to back. A static seed would make these identical.
      expect(first.join(',')).to.not.eq(second.join(','));
    });
  });

  describe('payment', () => {
    it('collects the tier price', async () => {
      await openPack(TIERS.degen);
      expect(await ethers.provider.getBalance(booster.address)).to.eq(TIERS.degen.price);
    });

    it('rejects underpayment', async () => {
      await expect(
        booster.connect(buyer).mintPack(TIERS.degen.id, { value: TIERS.starter.price })
      ).to.be.revertedWith('PepemonBoosterPack: Incorrect price');
    });

    it('rejects overpayment rather than silently keeping the change', async () => {
      await expect(
        booster.connect(buyer).mintPack(TIERS.starter.id, { value: TIERS.degen.price })
      ).to.be.revertedWith('PepemonBoosterPack: Incorrect price');
    });

    it('lets an admin withdraw takings', async () => {
      await openPack(TIERS.degen);

      const before = await ethers.provider.getBalance(buyer.address);
      await booster.withdraw(buyer.address);

      expect(await ethers.provider.getBalance(booster.address)).to.eq(0);
      expect(await ethers.provider.getBalance(buyer.address)).to.eq(before.add(TIERS.degen.price));
    });

    it('refuses withdrawals from non-admins', async () => {
      await expect(booster.connect(buyer).withdraw(buyer.address)).to.be.reverted;
    });
  });

  describe('reroll resistance', () => {
    it('refuses contract callers, which is what makes a bad roll cheap to discard', async () => {
      const Buyer = await ethers.getContractFactory('BoosterPackContractBuyer');
      const contractBuyer = await Buyer.deploy();
      await contractBuyer.deployed();

      await expect(
        contractBuyer.buy(booster.address, TIERS.degen.id, { value: TIERS.degen.price })
      ).to.be.revertedWith('PepemonBoosterPack: EOA only');
    });
  });

  describe('tier configuration', () => {
    it('rejects an unknown tier', async () => {
      await expect(booster.connect(buyer).mintPack(99, { value: 0 })).to.be.revertedWith(
        'PepemonBoosterPack: Unknown tier'
      );
    });

    it('rejects a disabled tier', async () => {
      const t = TIERS.starter;
      await booster.setTier(t.id, t.price, t.battle, t.common, t.rare, t.epic, false);

      await expect(booster.connect(buyer).mintPack(t.id, { value: t.price })).to.be.revertedWith(
        'PepemonBoosterPack: Unknown tier'
      );
    });

    it('refuses a tier that would draw more cards than a pool holds', async () => {
      // The epic pool has 8 ids, so a tier asking for 9 distinct epics can never be filled.
      await expect(booster.setTier(9, 0, 0, 0, 0, 9, true)).to.be.revertedWith(
        'PepemonBoosterPack: Epic pool too small'
      );
    });

    it('refuses tier and pool changes from non-admins', async () => {
      await expect(booster.connect(buyer).setTier(1, 0, 0, 1, 0, 0, true)).to.be.reverted;
      await expect(booster.connect(buyer).setPools([], [], [], [])).to.be.reverted;
    });

    it('reports pack size so the client does not have to add the fields up', async () => {
      expect(await booster.packSize(TIERS.degen.id)).to.eq(20);
      expect(await booster.packSize(TIERS.starter.id)).to.eq(5);
    });

    it('exposes price and enabled as plain values the client can read without tuple decoding', async () => {
      expect(await booster.tierPrice(TIERS.degen.id)).to.eq(TIERS.degen.price);
      expect(await booster.tierEnabled(TIERS.degen.id)).to.eq(true);

      // An unconfigured tier must read as disabled rather than looking free.
      expect(await booster.tierPrice(99)).to.eq(0);
      expect(await booster.tierEnabled(99)).to.eq(false);
    });

    it('exposes the pools so the client can show odds without hardcoding ids', async () => {
      const [battle, common, rare, epic] = await booster.getPools();
      expect(battle.map((b: BigNumber) => b.toNumber())).to.deep.eq(BATTLE_POOL);
      expect(common.map((b: BigNumber) => b.toNumber())).to.deep.eq(COMMON_POOL);
      expect(rare.map((b: BigNumber) => b.toNumber())).to.deep.eq(RARE_POOL);
      expect(epic.map((b: BigNumber) => b.toNumber())).to.deep.eq(EPIC_POOL);
    });
  });
});
