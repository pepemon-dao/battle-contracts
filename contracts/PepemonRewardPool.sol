// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./lib/RewardPool.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PepemonRewardPool is RewardPool, Ownable {
    struct Reward {
        uint256 tokenId;
        address tokenAddress;
    }
    Reward[] private rewardPool;

    // Transfer a token from the sender
    // store it in the pool
    // if not already done, approve the Matchmaker to transfer the token
    function addReward(address tokenAddress, uint256 tokenId) external override onlyOwner {
        require(
            ERC1155(tokenAddress).balanceOf(address(msg.sender), tokenId) > 0,
            "PepemonRewardPool: You don't have enough of this token"
        );

        ERC1155(tokenAddress).safeTransferFrom(address(msg.sender), address(this), tokenId, 1, "");
        rewardPool.push(Reward(tokenId, tokenAddress));
    }

    function addRewards(address tokenAddress, uint256 tokenId, uint256 amount) external onlyOwner {
        require(amount > 0, "PepemonRewardPool: Amount must be greater than 0");
        require(
            ERC1155(tokenAddress).balanceOf(address(msg.sender), tokenId) > 0,
            "PepemonRewardPool: You don't have enough of this token"
        );

        ERC1155(tokenAddress).safeTransferFrom(address(msg.sender), address(this), tokenId, amount, "");

        for (uint256 i = 0; i < amount; ++i) {
            rewardPool.push(Reward(tokenId, tokenAddress));
        }
    }

    function addRewardsBatch(
        address[] calldata tokenAddresses,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts
    ) external onlyOwner {
        require(tokenAddresses.length == tokenIds.length, "PepemonRewardPool: Arrays must be of the same size");
        require(tokenIds.length == amounts.length, "PepemonRewardPool: Arrays must be of the same size");

        for (uint256 i = 0; i < tokenAddresses.length; ++i) {
            ERC1155(tokenAddresses[i]).safeTransferFrom(
                address(msg.sender),
                address(this),
                tokenIds[i],
                amounts[i],
                ""
            );
            for (uint256 j = 0; j < amounts[i]; ++i) {
                rewardPool.push(Reward(tokenIds[i], tokenAddresses[i]));
            }
        }
    }

    // Do a weighted distribution
    // Implementation will depend on how rewards are stored, but it should give a higher chance of
    // getting common items (where more common items have been added)
    function getNextReward(
        uint256 rngSeed
    ) external override returns (address rewardTokenAddress, uint256 rewardTokenId) {
        uint256 index = uint256(keccak256(abi.encodePacked(uint256(42), rngSeed))) % rewardPool.length;
        // get reward
        rewardTokenAddress = rewardPool[index].tokenAddress;
        rewardTokenId = rewardPool[index].tokenId;
        // remove reward from pool
        rewardPool[index] = rewardPool[rewardPool.length - 1];
        rewardPool.pop();
        return (rewardTokenAddress, rewardTokenId);
    }
}
