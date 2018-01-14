pragma solidity ^0.4.13;

import './Gamble.sol';
import 'zeppelin-solidity/contracts/token/StandardToken.sol';

contract GambleToken is StandardToken {
  function initGame(address contractAddress,
					uint256 value,
					uint gameId,
					string dealerHash,
					string userSeed,
					bytes data) {
	transfer(contractAddress, value);
	Gamble(contractAddress)
	  .initGame(gameId,
				msg.sender,
				dealerHash,
				userSeed,
				value,
				data);
  }
}
