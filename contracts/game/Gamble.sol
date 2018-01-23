pragma solidity ^0.4.13;

contract Gamble {
  /* function initGame(uint id, */
  /* 					address player, */
  /* 					bytes32 dealerHash, */
  /* 					bytes32 userSeed, */
  /* 					uint bet, */
  /* 					bytes data) public returns(bool); */
  
  function playGame(uint id,
					address player,
					bytes32 dealerHash,
					bytes32 userSeed,
					uint bet,
					bytes32 dealerSeed,
					bool win,
					bytes data) public returns(bool);
}
