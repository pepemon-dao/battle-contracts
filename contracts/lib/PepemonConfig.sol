// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AdminRole.sol";
import "../iface/IConfigurable.sol";

/**
 * @notice This contract stores the addresses of all and any other contracts used by Pepemon
 * @dev This contract must be added as an Admin on contracts before "syncContractConfig" can be called.
 */
contract PepemonConfig is AdminRole {
    struct ContractDisplayData {
        address contractAddress;
        string contractName;
    } 

    string[] private contactsNames;
    mapping(string => address) public contractAddresses;

    /**
     * @notice Adds or updates contracts addresses associated by contract names
     * @param contractName Name of the contract that will be stored
     * @param contractAddress Address of the contract that will be stored
     * @param callSync When true, the function "syncConfig" of the contract being stored will be invoked
     */
    function setContractAddress(string calldata contractName, address contractAddress, bool callSync) external onlyAdmin {
        require(contractAddress != address(0));

        // If its the first time adding the contract, store its name in the array
        if (contractAddresses[contractName] == address(0)) {
            contactsNames.push(contractName);
        }
        contractAddresses[contractName] = contractAddress;
        if (callSync) {
            IConfigurable(contractAddress).syncConfig();
        }
    }

    /**
     * @dev Tries to call "syncConfig" from the address of the contract in `contractName`, this might fail if
     * the target contract does not have this contract (PepemonConfig) added as an Admin, or if `contractName` is not
     * associated with any contract
     */
    function syncContractConfig(string calldata contractName) external onlyAdmin {
        require(contractAddresses[contractName] != address(0));
        IConfigurable(contractAddresses[contractName]).syncConfig();
    }

    /**
     * @dev Displays contracts names and addresses.
     */
    function getContracts() external view returns (ContractDisplayData[] memory data) {
        uint256 len = contactsNames.length;
        
        data = new ContractDisplayData[](len);

        for (uint256 i = 0; i < len; ++i) {
            string memory contractName = contactsNames[i];
            data[i].contractName = contractName;
            data[i].contractAddress = contractAddresses[contractName];
        }
        return data;
    }
}
