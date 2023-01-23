// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface RewardPool {
    /**
     * @dev Adds a single reward into the pool.
     * @param tokenAddress Reward address
     * @param tokenId Reward id
     */
    function addReward(address tokenAddress, uint256 tokenId) external; //onlyAdmin

    /**
     * @dev Transfer an amount of a given token from the sender into the rewardPool
     * @param tokenAddress Reward address
     * @param tokenId Reward id
     * @param amount The number of items to be added to the pool.
     */
    function addRewards(address tokenAddress, uint256 tokenId, uint256 amount) external; //onlyAdmin

    /**
     * @dev Takes a random reward from rewardPool and sends it to someone.
     * @param rngSeed RNG seed of a Battle
     * @param account Address of who will receive the reward
     */
    function sendReward(uint256 rngSeed, address account) external; //onlyAdmin
}