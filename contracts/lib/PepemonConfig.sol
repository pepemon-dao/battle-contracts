// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AdminRole.sol";
import "../iface/IConfigurable.sol";

/**
 * @notice This contract stores the addresses of all and any other contracts used by Pepemon
 * @dev This contract must be added as an Admin on contracts before "syncContractConfig" can be called.
 */
contract PepemonConfig is AdminRole {
    string[] private contactsNames;
    mapping(string => address) public contractAddresses;

    /**
     * @notice Adds or updates contracts addresses associated by contract names
     * @param contractName Name of the contract that will be stored
     * @param contractAddress Address of the contract that will be stored
     * @param callSync When true, the function "syncConfig" of the contract being stored will be executed
     */
    function setContractAddress(string calldata contractName, address contractAddress, bool callSync) external onlyAdmin {
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
     * @dev Sets the names of mapped contracts which are used in `getContracts`
     * @param names Names of the mapped contracts 
     */
    function setContactsNames(string[] memory names) external onlyAdmin {
        contactsNames = names;
    }

    /**
     * @dev Displays contracts names and addresses. Names are set with `setContactsNames`
     * @return names All contract names
     * @return addresses All contract addresses
     */
    function getContracts() external view returns (string[] memory names, address[] memory addresses) {
        uint256 len = contactsNames.length;
        
        names = new string[](len);
        addresses = new address[](len);

        for (uint256 i = 0; i < len; ++i) {
            string memory contractName = contactsNames[i];
            names[i] = contractName;
            addresses[i] = contractAddresses[contractName];
        }
        return (names, addresses);
    }
}
