// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface PepemonFactory {
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _id,
        uint256 _amount,
        bytes calldata _data
    ) external;

    function setApprovalForAll(
        address _operator,
        bool _approved
    ) external;

    function balanceOf(
        address _owner, 
        uint256 _id
    ) external view returns (uint256);

    function airdrop(
        uint256 _id,
        address[] memory _addresses
    ) external;

    function batchMint(
        uint start, 
        uint end, 
        address to) 
    external;

    function addMinter(
        address account
    ) external;
}
