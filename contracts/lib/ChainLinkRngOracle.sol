// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "./AdminRole.sol";

abstract contract ChainLinkRngOracle is VRFConsumerBase, AdminRole {
    bytes32 immutable keyHash;
    bytes32 public lastRequestId;
    uint256 internal fee;

    address constant maticLink = 0xb0897686c545045aFc77CF20eC7A532E3120E0F1;
    address constant maticVrfCoordinator = 0x3d2341ADb2D31f1c5530cDC622016af293177AE0;
    bytes32 constant maticKeyHash = 0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da;

    address constant mumbaiLink = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    address constant mumbaiVrfCoordinator = 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255;
    bytes32 constant mumbaiKeyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;

    address constant fantomTestnetLink = 0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F;
    address constant fantomTestnetVrfCoordinator = 0xbd13f08b8352A3635218ab9418E340c60d6Eb418;
    bytes32 constant fantomTestnetKeyHash = 0x121a143066e0f2f08b620784af77cccb35c6242460b4a8ee251b4b416abaebd4;

    address constant fantomLink = 0x6F43FF82CCA38001B6699a8AC47A2d0E66939407;
    address constant fantomVrfCoordinator = 0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634;
    bytes32 constant fantomKeyHash = 0x5881eea62f9876043df723cf89f0c2bb6f950da25e9dfe66995c24f919c8f8ab;



    mapping(bytes32 => uint256) internal results;

    constructor() VRFConsumerBase(fantomTestnetVrfCoordinator, fantomTestnetLink) {
        keyHash = fantomTestnetKeyHash;
        fee = 1 ether / 1000;
    }

    //Get a new random number (paying link for it)
    //Only callable by admin
    function getNewRandomNumber() public onlyAdmin returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        lastRequestId = requestRandomness(keyHash, fee);
        return lastRequestId;
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        results[requestId] = randomness;
    }

    function fetchNumberByRequestId(bytes32 _requestId) public view returns (uint256) {
        return results[_requestId];
    }

    //Get most recent random number and use that as randomness source    
    function getRandomNumber() public view returns (uint256){
        return fetchNumberByRequestId(lastRequestId);        
    }
}
