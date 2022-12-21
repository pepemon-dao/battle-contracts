// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface RewardPool {
    // Transfer a token from the sender
    // store it in the pool
    // if not already done, approve the Matchmaker to transfer the token
    function addReward(address tokenAddress, uint256 tokenId) external; //onlyAdmin

    // Do a weighted distribution
    // Implementation will depend on how rewards are stored, but it should give a higher chance of
    // getting common items (where more common items have been added)
    function getNextReward(uint256 rngSeed) external returns (address rewardTokenAddress, uint256 rewardTokenId);
}