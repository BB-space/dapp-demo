pragma solidity ^0.4.13;


contract SHA3Test {
    function getSHA3Hash(string input) returns (bytes32 hashedOutput) {
        hashedOutput = keccak256(input);
    }
}

