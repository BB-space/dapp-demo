pragma solidity ^0.4.13;


contract SHA3Test {
  function bytes32ToString (bytes32 data) returns (string) {
    bytes memory bytesString = new bytes(32);
    for (uint j=0; j<32; j++) {
	  byte char = byte(bytes32(uint(data) * 2 ** (8 * j)));
	  if (char != 0) {
		bytesString[j] = char;
	  }
    }
    return string(bytesString);
  }
  
  function getSHA3Hash(string input) returns (string hashedOutput) {
	hashedOutput = bytes32ToString(keccak256(input));
  }

  function bytesTest(bytes data) returns (bytes){
	return data;
  }
}

