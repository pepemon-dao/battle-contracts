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
     * @dev Actual implementation for both setContractAddress and batchSetContractAddress, making a call to
     * a common 'internal' function uses less gas than calling a 'public' one
     */
    function setContractAddressInternal(string calldata contractName, address contractAddress, bool callSync) internal {
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
     * @notice Adds or updates contracts addresses associated by contract names
     * @param contractName Name of the contract that will be stored
     * @param contractAddress Address of the contract that will be stored
     * @param callSync When true, the function "syncConfig" of the contract being stored will be invoked
     */
    function setContractAddress(
        string calldata contractName,
        address contractAddress,
        bool callSync
    ) external onlyAdmin {
        setContractAddressInternal(contractName, contractAddress, callSync);
    }

    /**
     * @notice Batch version of `setContractAddress`
     * @param contractNameList Names of the contracts that will be stored
     * @param contractAddressesList Addresses of the contracts that will be stored
     * @param callSyncList When true, the function "syncConfig" of the contracts being stored will be invoked
     */
    function batchSetContractAddress(
        string[] calldata contractNameList,
        address[] calldata contractAddressesList,
        bool[] calldata callSyncList
    ) external onlyAdmin {
        uint256 len = contractNameList.length;
        require(len == contractAddressesList.length && len == callSyncList.length, "Mismatching batch length");
        for (uint256 i = 0; i < len; ++i) {
            setContractAddressInternal(contractNameList[i], contractAddressesList[i], callSyncList[i]);
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
     * @dev Batch version of syncContractConfig
     */
    function batchSyncContractConfig(string[] calldata contractNames) external onlyAdmin {
        uint256 len = contractNames.length;
        for (uint256 i = 0; i < len; ++i) {
            require(contractAddresses[contractNames[i]] != address(0));
            IConfigurable(contractAddresses[contractNames[i]]).syncConfig();
        }
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
