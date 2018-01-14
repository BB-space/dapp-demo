pragma solidity ^0.4.13;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';
import './GambleToken.sol';


contract Tulip is MintableToken, GambleToken {
  string public name = "TULIP";
  string public symbol = "TLP";
  uint8 public decimals = 18;
}
