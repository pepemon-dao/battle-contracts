import {providers, Wallet} from 'ethers';
import hre from 'hardhat'
import { deployContract, MockProvider } from 'ethereum-waffle';
import DeckArtifact from '../../artifacts/contracts/PepemonCardDeck.sol/PepemonCardDeck.json';
import BattleArtifact from '../../artifacts/contracts/PepemonBattle.sol/PepemonBattle.json';
import PepemonMatchmakerArtifact from '../../artifacts/contracts-exposed/PepemonMatchmaker.sol/XPepemonMatchmaker.json';
import PepemonRewardPoolArtifact from '../../artifacts/contracts-exposed/PepemonRewardPool.sol/XPepemonRewardPool.json';

import { Signer } from 'ethers';
import { PepemonCardDeck, PepemonBattle, PepemonMatchmaker, PepemonRewardPool } from '../../typechain';

let provider: providers.JsonRpcProvider;

export function getProvider() {
  if (provider == undefined) {
    provider = hre.ethers.provider;
  }

  return provider;
}

export function getWallets() {
  let p = getProvider();
  return [
    new Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", p),
    new Wallet("0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", p),
    new Wallet("0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6", p),
    new Wallet("0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a", p)
  ];
}

export async function deployDeckContract(signer: Signer) {
  return (await deployContract(signer, DeckArtifact)) as PepemonCardDeck;
}

export async function deployBattleContract(signer: Signer) {
  return (await deployContract(signer, BattleArtifact)) as PepemonBattle;
}

export async function deployMatchmakerContract(signer: Signer, defaultRanking: Number) {
  return (await deployContract(signer, PepemonMatchmakerArtifact, [defaultRanking])) as PepemonMatchmaker;
}

export async function deployRewardPoolContract(signer: Signer) {
  return (await deployContract(signer, PepemonRewardPoolArtifact)) as PepemonRewardPool;
}

export async function mineBlock() {
  await getProvider().send('evm_mine', []);
}

export async function wait(secondsToWait: number) {
  // Update the clock
  await getProvider().send('evm_increaseTime', [secondsToWait]);

  // Process the block
  await mineBlock();
}

export async function getBlockTime() {
  return await getProvider()
    .getBlock(getBlockNumber())
    .then((block) => block.timestamp);
}

export async function getBlockNumber() {
  return await getProvider().getBlockNumber();
}
