import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { PEPEMON_MATCHMAKER, PEPEMON_DECK, PEPEMON_BATTLE, USE_TESTNET_ADDRESSES, PEPEMON_FACTORY } from '../deploy/constants';
import { BATTLECARDS, SUPPORTCARDS } from '../deploy/cards';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { deployer } = await getNamedAccounts();

  const hardhatTestAddr = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
  const p2HardhatTestAddr = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

  await hre.deployments.execute(PEPEMON_DECK, { from: deployer, log: true }, 'setMinSupportCards', 1);
  
  const firstCardId = 1;
  const lastCardId = BATTLECARDS.length + SUPPORTCARDS.length;

  console.log(`Minting cards ${firstCardId}-${lastCardId} to ${hardhatTestAddr} and ${p2HardhatTestAddr}`);
  await hre.deployments.execute(PEPEMON_FACTORY, {from: hardhatTestAddr}, "batchMint", firstCardId, lastCardId, hardhatTestAddr);
  await hre.deployments.execute(PEPEMON_FACTORY, {from: hardhatTestAddr}, "batchMint", firstCardId, lastCardId, p2HardhatTestAddr);
  
  let deckContract = await hre.deployments.get(PEPEMON_DECK);

  // allows minting test cards
  await hre.deployments.execute(PEPEMON_FACTORY, {from: hardhatTestAddr}, "addMinter", deckContract.address);
  await hre.deployments.execute(PEPEMON_DECK, { from: deployer, log: true }, 'setMintingCards', firstCardId, lastCardId);

  // Allow fighting yourself
  await hre.deployments.execute(PEPEMON_MATCHMAKER, {from: hardhatTestAddr}, "setAllowBattleAgainstOneself", true);
  await hre.deployments.execute(PEPEMON_BATTLE, {from: hardhatTestAddr}, "setAllowBattleAgainstOneself", true);

  // Speed up tests by setting common stuff
  let pepemonMatchmaker = await hre.deployments.get(PEPEMON_MATCHMAKER);
  let pepemonFactory = await hre.deployments.get(PEPEMON_FACTORY);
  const players: any = {
    [hardhatTestAddr]: {
      "deckId": 1,
      "battleCard": 3, // battleCard to be set for player 1
      "supportCards": [12,14,16,18,20,22,24,26,28,30] // supportCards to be set for player 1
    },
    [p2HardhatTestAddr]: {
      "deckId": 2,
      "battleCard": 4,
      "supportCards": [11,12,13,14,15,16,17,18,19,20]
    }
  }
  
  for (let player of Object.keys(players)) {
    const pepemonFactorySignedBy = await hre.ethers.getContractAt("PepemonFactory", pepemonFactory.address, await hre.ethers.getSigner(player));

    console.log("Runnning pepermonFactory.setApprovalForAll for " + player);
    await pepemonFactorySignedBy.setApprovalForAll(deckContract.address, true);

    console.log("Runnning pepemonCardDeck.setApprovalForAll for " + player);
    await hre.deployments.execute(PEPEMON_DECK, {from: player}, "setApprovalForAll", pepemonMatchmaker.address, true);
  
    console.log("Creating deck for " + player);
    await hre.deployments.execute(PEPEMON_DECK, {from: player}, "createDeck");

    console.log(`Setting BattleCard ${players[player].battleCard} on deck ${players[player].deckId}`);
    await hre.deployments.execute(PEPEMON_DECK, {from: player}, "addBattleCardToDeck", players[player].deckId, players[player].battleCard);
    
    for (let card of players[player].supportCards){
      console.log(`Setting SupportCard ${card} on deck ${players[player].deckId}`);
      await hre.deployments.execute(PEPEMON_DECK, {from: player}, "addSupportCardsToDeck", players[player].deckId, [[card, 1]]);
    }
  }

  console.log("Player 2 joining match");
  await hre.deployments.execute(PEPEMON_MATCHMAKER, {from: p2HardhatTestAddr}, "enter", players[p2HardhatTestAddr].deckId);
};

export default func;

func.tags = ['test-env'];
func.dependencies = [PEPEMON_DECK, PEPEMON_BATTLE, 'SETUP_CARDS']
