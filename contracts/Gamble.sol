pragma solidity ^0.4.13;

contract Gamble {
  function initGame(uint id,
					address player,
					string dealerHash,
					string userSeed,
					uint bet,
					bytes data) public returns(bool);
}
