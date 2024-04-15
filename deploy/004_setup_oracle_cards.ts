import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { PEPEMON_CARD_ORACLE } from './constants';
import { BATTLECARDS, SUPPORTCARDS, SUPPORTCARDS_ORACLE, factoryBattlecardStats, factorySupportcardStats } from './cards';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { execute } = deployments;

  const makeOracleBattlecard = function (id: number, stats: (string | number)[]) {
    return [
      /*battleCardId  */ id, 
      /*battleCardType*/ stats[factoryBattlecardStats.element],
      /*hp            */ stats[factoryBattlecardStats.hp],
      /*spd           */ stats[factoryBattlecardStats.speed],
      /*inte          */ stats[factoryBattlecardStats.intelligence],
      /*def           */ stats[factoryBattlecardStats.defense],
      /*atk           */ stats[factoryBattlecardStats.attack],
      /*sAtk          */ stats[factoryBattlecardStats.specialAttack],
      /*sDef          */ stats[factoryBattlecardStats.specialDefense],
    ]
  }

  console.log(`Creating battle cards on contract: ${PEPEMON_CARD_ORACLE}...`);
  for(let i = 0; i < BATTLECARDS.length; i++){
    const stats = BATTLECARDS[i];
    console.log(`Creating BattleCard: ${stats[9]} `);
    await execute(PEPEMON_CARD_ORACLE, { from: deployer, log: true }, 'addBattleCard', 
      makeOracleBattlecard(i + 1, stats),  // cardData with id offset
    )
  }

  console.log(`Creating support cards on contract: ${PEPEMON_CARD_ORACLE}..`);
  for(const element of SUPPORTCARDS_ORACLE) {
    console.log(`Creating SupportCard: ${element[2]}`);
    await execute(PEPEMON_CARD_ORACLE, { from: deployer, log: true }, 'addSupportCard', 
      element   // cardData
    )
  }

  console.log("Cards created successfully.");
};

export default func;

func.tags = [PEPEMON_CARD_ORACLE];

