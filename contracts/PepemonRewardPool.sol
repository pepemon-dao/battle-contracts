// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./lib/RewardPool.sol";
import "./lib/AdminRole.sol";

contract PepemonRewardPool is RewardPool, ERC1155Holder, AdminRole {
    struct Reward {
        uint256 tokenId;
        address tokenAddress;
    }
    Reward[] internal rewardPool;

    /**
     * @dev Adds a single reward into the pool.
     * @param tokenAddress Reward address
     * @param tokenId Reward id
     */
    function addReward(address tokenAddress, uint256 tokenId) external override onlyAdmin {
        require(
            ERC1155(tokenAddress).balanceOf(address(msg.sender), tokenId) > 0,
            "PepemonRewardPool: You don't have enough of this token"
        );
        ERC1155(tokenAddress).safeTransferFrom(address(msg.sender), address(this), tokenId, 1, "");
        rewardPool.push(Reward(tokenId, tokenAddress));
    }

    /**
     * @dev Transfer an amount of a given token from the sender into the rewardPool
     * @param tokenAddress Reward address
     * @param tokenId Reward id
     * @param amount The number of items to be added to the pool.
     */
    function addRewards(address tokenAddress, uint256 tokenId, uint256 amount) external override onlyAdmin {
        require(
            ERC1155(tokenAddress).balanceOf(address(msg.sender), tokenId) > 0,
            "PepemonRewardPool: You don't have enough of this token"
        );
        require(amount > 0, "PepemonRewardPool: Amount must be greater than 0");

        ERC1155(tokenAddress).safeTransferFrom(address(msg.sender), address(this), tokenId, amount, "");

        for (uint256 i = 0; i < amount; ++i) {
            rewardPool.push(Reward(tokenId, tokenAddress));
        }
    }

    /**
     * @dev Batch version of addRewards
     */
    function addRewardsBatch(
        address[] calldata tokenAddresses,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts
    ) external onlyAdmin {
        require(
            tokenAddresses.length == tokenIds.length && tokenIds.length == amounts.length,
            "PepemonRewardPool: Arrays must be of the same size"
        );

        for (uint256 i = 0; i < tokenAddresses.length; ++i) {
            ERC1155(tokenAddresses[i]).safeTransferFrom(
                address(msg.sender),
                address(this),
                tokenIds[i],
                amounts[i],
                ""
            );
            for (uint256 j = 0; j < amounts[i]; ++j) {
                rewardPool.push(Reward(tokenIds[i], tokenAddresses[i]));
            }
        }
    }

    /**
     * @dev Takes a random reward from rewardPool and sends it to someone.
     * @param rngSeed RNG seed of a Battle
     * @param account Address of who will receive the reward
     */
    function sendReward(uint256 rngSeed, address account) external override onlyAdmin {
        // TODO: emit event when this happens
        if (rewardPool.length == 0) {
            return;
        }
        uint256 index = uint256(keccak256(abi.encodePacked(uint256(42), rngSeed))) % rewardPool.length;
        // get reward
        address rewardTokenAddress = rewardPool[index].tokenAddress;
        uint256 rewardTokenId = rewardPool[index].tokenId;
        
        // remove reward from pool
        rewardPool[index] = rewardPool[rewardPool.length - 1];
        rewardPool.pop();
        ERC1155(rewardTokenAddress).safeTransferFrom(address(this), account, rewardTokenId, 1, "");
    }
}
