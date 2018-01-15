pragma solidity ^0.4.13;

contract Gamble {
  function initGame(uint id,
					address player,
					bytes32 dealerHash,
					bytes32 userSeed,
					uint bet,
					bytes data) public returns(bool);
}
