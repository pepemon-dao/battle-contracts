import { ethers, network, run } from 'hardhat';

/**
 * Deploys PepemonBoosterPack and configures its pools and tiers.
 *
 * This deliberately needs no privileged key. The booster sources cards through
 * PepemonCardDeck.mintCards(), which is permissionless, so whoever runs this becomes the
 * booster's own admin without needing minter or admin rights on any existing contract.
 *
 *   PRIVATE_KEY=0x... npx hardhat run scripts/deployBoosterPack.ts --network base_sepolia
 */

// Live Base Sepolia deployment. Override for other chains.
const FACTORY = process.env.PEPEMON_FACTORY ?? '0x888c830242caAa352DC506a2C79d38B3e86102aD';
const CARD_DECK = process.env.PEPEMON_CARD_DECK ?? '0x8D3fc40550a6aBFAa9710A5b256A89bE3324CC0e';

// Card ids grouped by the rarity recorded in deploy/cards.ts. Battle cards are ids 1-10 and are
// all Common, so they form their own pool rather than being mixed into the common one.
const BATTLE_POOL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const COMMON_POOL = [11, 12, 13, 14, 15, 16, 17, 27, 28, 29];
const RARE_POOL = [18, 19, 20, 21, 22, 25, 30, 31, 32, 33, 34, 36, 37, 40, 41, 42, 43, 44, 46, 47, 48];
const EPIC_POOL = [23, 24, 26, 35, 38, 39, 45, 49];

// Rarity counts are fixed per tier rather than probabilistic. Every pack is then worth what it
// advertises, which matters more during onboarding than the thrill of a dud pack. The variety
// comes from which card of each rarity you draw.
const TIERS = [
  { id: 1, name: 'Starter', price: '0.0001', battle: 0, common: 4, rare: 1, epic: 0 },
  { id: 2, name: 'Trainer', price: '0.0003', battle: 1, common: 5, rare: 3, epic: 1 },
  { id: 3, name: 'Degen', price: '0.001', battle: 2, common: 8, rare: 7, epic: 3 },
];

/**
 * Blocks until the RPC actually reports code at an address.
 *
 * A deployment receipt only proves one node saw the transaction. Public endpoints are load
 * balanced, so the very next request can hit a node that has not caught up and reports the
 * address as empty.
 */
async function waitForCode(address: string, attempts = 30) {
  for (let i = 0; i < attempts; i++) {
    if ((await ethers.provider.getCode(address)) !== '0x') return;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error(`Timed out waiting for contract code at ${address}`);
}

/** Sends a configuration transaction and fails loudly if it reverted. */
async function send(label: string, call: () => Promise<any>) {
  const tx = await call();
  const receipt = await tx.wait();
  if (receipt.status !== 1) {
    throw new Error(`${label.trim()} FAILED - transaction ${tx.hash} reverted`);
  }
  console.log(label);
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`network  : ${network.name}`);
  console.log(`deployer : ${deployer.address}`);
  console.log(`balance  : ${ethers.utils.formatEther(await deployer.getBalance())} ETH`);

  // Calling an address with no code succeeds silently, so the faucet check below would pass
  // against an empty chain and happily deploy a booster wired to nothing.
  for (const [label, address] of [
    ['factory', FACTORY],
    ['card deck', CARD_DECK],
  ]) {
    if ((await ethers.provider.getCode(address)) === '0x') {
      throw new Error(`No contract deployed at ${label} address ${address} on ${network.name}`);
    }
  }

  // The booster is useless if the faucet it sources from is switched off, and that failure
  // would otherwise only show up as a revert on a player's first purchase.
  const faucet = new ethers.Contract(CARD_DECK, ['function mintCards()'], deployer);
  try {
    await faucet.callStatic.mintCards();
    console.log('faucet   : mintCards() is callable');
  } catch (e: any) {
    console.error('\nABORT: PepemonCardDeck.mintCards() reverts, so packs cannot source cards.');
    console.error('An admin has likely called setMintingCards(_, 0). This contract needs either');
    console.error('the faucet re-enabled, or a minter role on the factory instead.\n');
    throw e;
  }

  const BoosterPack = await ethers.getContractFactory('PepemonBoosterPack');

  // Set BOOSTER_ADDRESS to configure a contract that is already deployed, rather than paying to
  // deploy another one. Useful when deployment succeeded but configuration did not.
  let booster;
  if (process.env.BOOSTER_ADDRESS) {
    booster = BoosterPack.attach(process.env.BOOSTER_ADDRESS);
    console.log(`booster  : ${booster.address} (existing)`);
  } else {
    booster = await BoosterPack.deploy(FACTORY, CARD_DECK);
    await booster.deployed();
    console.log(`booster  : ${booster.address}`);
  }

  await waitForCode(booster.address);

  // Explicit gas limits on every configuration call. deployed() resolving is not a promise that
  // the next JSON-RPC request reaches a node which has the contract: public endpoints such as
  // sepolia.base.org are load balanced, and an estimate answered by a node that has not caught
  // up prices the call as a transfer to an empty account, about 41k gas. The transaction is then
  // sent with that limit and runs out of gas. Fixed limits do not depend on estimation at all.
  await send('pools    : configured', () =>
    booster.setPools(BATTLE_POOL, COMMON_POOL, RARE_POOL, EPIC_POOL, { gasLimit: 4000000 })
  );

  for (const tier of TIERS) {
    const size = tier.battle + tier.common + tier.rare + tier.epic;
    await send(`tier ${tier.id}   : ${tier.name.padEnd(8)} ${tier.price} ETH  ${size} cards`, () =>
      booster.setTier(
        tier.id,
        ethers.utils.parseEther(tier.price),
        tier.battle,
        tier.common,
        tier.rare,
        tier.epic,
        true,
        { gasLimit: 300000 }
      )
    );
  }

  console.log('\nPaste this address into Web3Settings.pepemonBoosterPackAddress in Unity:');
  console.log(`  ${booster.address}`);

  if (process.env.ETHERSCAN_API_KEY || network.name === 'base_sepolia') {
    console.log('\nVerifying on the block explorer...');
    try {
      await run('verify:verify', { address: booster.address, constructorArguments: [FACTORY, CARD_DECK] });
    } catch (e: any) {
      console.log(`verify skipped: ${e.message}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
