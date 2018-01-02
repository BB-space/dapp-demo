pragma solidity ^0.4.13;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';

contract Tulip is MintableToken {
  string public name = "TULIP";
  string public symbol = "TLP";
  uint8 public decimals = 18;
}