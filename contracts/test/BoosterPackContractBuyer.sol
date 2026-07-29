// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IPepemonBoosterPack {
    function mintPack(uint8 tierId) external payable;
}

/**
 * @dev Test-only contract used to prove PepemonBoosterPack rejects contract callers.
 *
 * A contract caller is what makes a single-transaction pack roll exploitable: it can inspect
 * what it drew and revert on a bad roll, paying only gas until it hits an Epic. This exists so
 * that defence is covered by a test rather than asserted in a comment.
 */
contract BoosterPackContractBuyer {
    function buy(address booster, uint8 tierId) external payable {
        IPepemonBoosterPack(booster).mintPack{value: msg.value}(tierId);
    }
}
