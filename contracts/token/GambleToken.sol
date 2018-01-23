pragma solidity ^0.4.13;

import './ERC20.sol';
import '../game/Gamble.sol';


contract GambleToken is ERC20 {
  /* function makeGame(address contractAddress, */
  /* 					uint256 value, */
  /* 					uint gameId, */
  /* 					bytes32 dealerHash, */
  /* 					bytes32 userSeed, */
  /* 					bytes data) { */
  /* 	transfer(contractAddress, value); */
  /* 	Gamble(contractAddress) */
  /* 	  .initGame(gameId, */
  /* 				msg.sender, */
  /* 				dealerHash, */
  /* 				userSeed, */
  /* 				value, */
  /* 				data); */
  /* } */
  
  function makeOneTimeGame(address contractAddress,
						   uint256 value,
						   uint gameId,
						   bytes32 dealerHash,
						   bytes32 userSeed,
						   bytes32 dealerSeed,
						   bool win,
						   bytes data) {
	transfer(contractAddress, value);
	Gamble(contractAddress)
	  .playGame(gameId,
				msg.sender,
				dealerHash,
				userSeed,
				value,
				dealerSeed,
				win,
				data);
  }
}
