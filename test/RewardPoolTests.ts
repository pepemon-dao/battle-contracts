import { deployRewardPoolContract, getWallets } from './helpers/contract';
import { PepemonRewardPool, PepemonCardDeck, Erc1155 } from '../typechain';
import Erc1155Artifact from '../artifacts/@openzeppelin/contracts/token/ERC1155/ERC1155.sol/ERC1155.json';

import { expect } from 'chai';
import { deployMockContract, MockContract } from 'ethereum-waffle';

const [alice, bob, dolores] = getWallets();
const rewardId = 1;

describe('::RewardPool', async () => {
  let rewardPool: PepemonRewardPool;
  let bobSignedMatchmaker: PepemonRewardPool;
  let doloresSignedMatchmaker: PepemonRewardPool;
  let reward: Erc1155 | MockContract;

  // each time this is called, it returns an incremental number
  let getBattleSeed = ((i)=>()=>i++)(0);

  beforeEach(async () => {
    rewardPool = await deployRewardPoolContract(alice);
    bobSignedMatchmaker = rewardPool.connect(bob);
    doloresSignedMatchmaker = rewardPool.connect(dolores);
    reward = await deployMockContract(alice, Erc1155Artifact.abi);
  });

  describe('#Permissions', async () => {
    it('Should prevent anyone but whitelisted accounts from adding rewards', async () => {
      // mock reward transfer. all transfers will be allowed
      await reward.mock.safeTransferFrom.returns();
      await reward.mock.balanceOf.returns(10);

      // alice and dolores are admins, bob is not
      await rewardPool.addAdmin(dolores.address);

      /* should NOT revert */
      await expect(doloresSignedMatchmaker.addReward(reward.address, rewardId)).to.not.be.reverted;
      await expect(doloresSignedMatchmaker.addRewards(reward.address, rewardId, 2)).to.not.be.reverted;
      await expect(doloresSignedMatchmaker.addRewardsBatch([reward.address], [rewardId], [1])).to.not.be.reverted;

      await expect(rewardPool.addReward(reward.address, rewardId)).to.not.be.reverted;
      await expect(rewardPool.addRewards(reward.address, rewardId, 2)).to.not.be.reverted;
      await expect(rewardPool.addRewardsBatch([reward.address], [rewardId], [1])).to.not.be.reverted;

      /* should revert */
      await expect(bobSignedMatchmaker.addReward(reward.address, rewardId)).to.be.reverted;
      await expect(bobSignedMatchmaker.addRewards(reward.address, rewardId, 2)).to.be.reverted;
      await expect(bobSignedMatchmaker.addRewardsBatch([reward.address], [rewardId], [1])).to.be.reverted;
    });

    it('Should prevent anyone but whitelisted accounts from sending rewards', async () => {
      // alice and dolores are admins, bob is not
      await rewardPool.addAdmin(dolores.address);

      // mock reward transfer. all transfers will be allowed
      await reward.mock.safeTransferFrom.returns();
      await reward.mock.balanceOf.returns(10);

      // add rewards to pool
      await rewardPool.addRewards(reward.address, rewardId, 2);

      await expect(bobSignedMatchmaker.sendReward(getBattleSeed(), bob.address)).to.be.reverted;

      await expect(doloresSignedMatchmaker.sendReward(getBattleSeed(), reward.address)).to.not.be.reverted;
      await expect(rewardPool.sendReward(getBattleSeed(), reward.address)).to.not.be.reverted;
    });
  });

  describe('#Rewards', async () => {
    it('Should add/remove rewards from the pool correctly', async () => {
      // mock reward transfer. all transfers will be allowed
      await reward.mock.safeTransferFrom.returns();
      await reward.mock.balanceOf.returns(4);
      const differentRewardId = 2;

      // add rewards
      await rewardPool.addReward(reward.address, rewardId);
      await expect((await rewardPool.xrewardPool()).length).to.be.equal(1);

      await rewardPool.addRewardsBatch([reward.address], [rewardId], [1]);
      await expect((await rewardPool.xrewardPool()).length).to.be.equal(2);

      await rewardPool.addRewards(reward.address, differentRewardId, 2); // adding a different reward token
      await expect((await rewardPool.xrewardPool()).length).to.be.equal(4);


      // take rewards
      await rewardPool.sendReward(getBattleSeed(), reward.address);
      await expect((await rewardPool.xrewardPool()).length).to.be.equal(3);

      await rewardPool.sendReward(getBattleSeed(), reward.address);
      await expect((await rewardPool.xrewardPool()).length).to.be.equal(2);

      await rewardPool.sendReward(getBattleSeed(), reward.address);
      await expect((await rewardPool.xrewardPool()).length).to.be.equal(1);

      await rewardPool.sendReward(getBattleSeed(), reward.address);
      await expect((await rewardPool.xrewardPool()).length).to.be.equal(0);
    });
  });
});
