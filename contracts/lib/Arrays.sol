// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library Arrays {
    //Shuffles an array of uints with random seed
    function shuffle(uint256[] memory _elements, uint256 _seed) internal pure returns (uint256[] memory) {
        for (uint256 i = 0; i < _elements.length; i++) {
            //Pick random index to swap current element with
            uint256 n = i + _seed % (_elements.length - i);

            //swap elements
            uint256 temp = _elements[n];
            _elements[n] = _elements[i];
            _elements[i] = temp;

            //Create new pseudorandom number using seed.
            _seed = uint(keccak256(abi.encodePacked(_seed)));
        }
        return _elements;
    }

    // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/0a3f880753112b425160086c97623b1ab38bfec6/contracts/utils/Arrays.sol

    /**
     * @dev Searches an `array` sorted in ascending order and returns the first
     * index that contains a value greater or equal than `element`. If no such index
     * exists (i.e. all values in the array are strictly less than `element`), the array
     * length is returned. Time complexity O(log n).
     *
     * See C++'s https://en.cppreference.com/w/cpp/algorithm/lower_bound[lower_bound].
     */
    function lowerBoundMemory(uint256[] memory array, uint256 element) internal pure returns (uint256) {
        uint256 low = 0;
        uint256 high = array.length;

        if (high == 0) {
            return 0;
        }

        while (low < high) {
            uint256 mid = average(low, high);

            // Note that mid will always be strictly less than high (i.e. it will be a valid array index)
            // because Math.average rounds towards zero (it does integer division with truncation).
            if (unsafeMemoryAccess(array, mid) < element) {
                // this cannot overflow because mid < high
                unchecked {
                    low = mid + 1;
                }
            } else {
                high = mid;
            }
        }

        return low;
    }

    /**
     * @dev Access an array in an "unsafe" way. Skips solidity "index-out-of-range" check.
     *
     * WARNING: Only use if you are certain `pos` is lower than the array length.
     */
    function unsafeMemoryAccess(uint256[] memory arr, uint256 pos) internal pure returns (uint256 res) {
        assembly {
            res := mload(add(add(arr, 0x20), mul(pos, 0x20)))
        }
    }

    // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/0a3f880753112b425160086c97623b1ab38bfec6/contracts/utils/math/Math.sol
    
    /**
     * @dev Returns the average of two numbers. The result is rounded towards
     * zero.
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow.
        return (a & b) + (a ^ b) / 2;
    }


    function isSortedAscending(uint256[] memory arr) internal pure returns (bool) {
        uint256 length = arr.length - 1;
        for (uint256 i = 0; i < length; i++) {
            uint256 current = unsafeMemoryAccess(arr, i);
            uint256 next = unsafeMemoryAccess(arr, i + 1);
            if (current > next) {
                return false;
            }
        }
        return true;
    }

    function contains(uint256[] memory arr, uint256 value) internal pure returns (bool) {
        uint256 index = lowerBoundMemory(arr, value);
        if (index == arr.length || unsafeMemoryAccess(arr, index) != value) {
            return false;
        }
        return true;
    }
}
