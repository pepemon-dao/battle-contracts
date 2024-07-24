// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PepemonMatchmaker.sol";

contract PepemonMatchmakerPve is PepemonMatchmaker {
    constructor(uint256 defaultRanking, address _configAddress) PepemonMatchmaker(defaultRanking, _configAddress) {
        setPveMode(true);
    }
}
