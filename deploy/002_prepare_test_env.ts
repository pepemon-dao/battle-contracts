import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { PEPEMON_MATCHMAKER, SUPPORT_CARD_ADDRESS, PEPEMON_DECK, PEPEMON_BATTLE, PEPEMON_CARD_ORACLE, RNG_ORACLE, USE_TESTNET_ADDRESSES } from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;

  const testCardOwnerAddr = USE_TESTNET_ADDRESSES ? '0xE9600B3025C1291F2aA211a71bC41B6bfb82bFdD' : '0x9615c6684686572D77D38d5e25Bc58472560E22C';
  const hardhatTestAddr = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
  const p2HardhatTestAddr = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

  // Impersonate to take some cards from the creator
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [testCardOwnerAddr]
  });
  const signer = await hre.ethers.getSigner(testCardOwnerAddr);
  
  console.log("Loading PepemonFactory ...")
  const pepemonFactory = await hre.ethers.getContractAt("PepemonFactory", SUPPORT_CARD_ADDRESS, signer);

  let promises = []
  for (let i = 1; i < 30; i++) {
    console.log(`Transferring card ${i} from ${testCardOwnerAddr} to ${hardhatTestAddr} and ${p2HardhatTestAddr}`);
    promises.push(await pepemonFactory.safeTransferFrom(testCardOwnerAddr, hardhatTestAddr, i, 1, []));
    promises.push( pepemonFactory.safeTransferFrom(testCardOwnerAddr, p2HardhatTestAddr, i, 1, []));
  }
  await Promise.all(promises);

  // Stop impersonating
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [testCardOwnerAddr]
  });

  // Allow fighting yourself
  await hre.deployments.execute(PEPEMON_MATCHMAKER, {from: hardhatTestAddr}, "setAllowBattleAgainstOneself", true);
  await hre.deployments.execute(PEPEMON_BATTLE, {from: hardhatTestAddr}, "setAllowBattleAgainstOneself", true);

  // Speed up tests by setting common stuff
  let deckContract = await hre.deployments.get(PEPEMON_DECK);
  let pepemonMatchmaker = await hre.deployments.get(PEPEMON_MATCHMAKER);
  const players: any = {
    [hardhatTestAddr]: {
      "deckId": 1,
      "battleCard": 2, // battleCard to be set for player 1
      "supportCards": [15, 28] // supportCards to be set for player 1
    },
    [p2HardhatTestAddr]: {
      "deckId": 2,
      "battleCard": 3,
      "supportCards": [17, 28]
    }
  }
  for (let player of Object.keys(players)) {
    const pepemonFactorySignedBy = await hre.ethers.getContractAt(
      "PepemonFactory", SUPPORT_CARD_ADDRESS, await hre.ethers.getSigner(player));

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
func.dependencies = [PEPEMON_DECK, PEPEMON_BATTLE, PEPEMON_CARD_ORACLE, RNG_ORACLE, 'SETUP_CARDS']
