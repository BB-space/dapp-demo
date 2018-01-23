pragma solidity ^0.4.13;

import './game/Gamble.sol';
import './token/GambleToken.sol';


contract OddEven is Gamble {
  address owner;
  GambleToken public token;

  struct Game {
    address player;
    bytes32 dealerHash;
    bytes32 userSeed;
    bytes32 dealerSeed;
    uint bet;
	bool playerWin;
    bool finalized;
	bytes data;
  }
  /* use game id as key of the following mapping*/
  mapping(uint => Game) games;

  modifier onlyowner {
    require(owner == msg.sender);
    _;
  }

  function OddEven(address tokenAddress) {
    owner = msg.sender;
	token = GambleToken(tokenAddress);
  }

  function getEther() payable {

  }

  function changeToken(address newTokenAddress) {
	token = GambleToken(newTokenAddress);
  }

  function playGame(uint id,
					address player,
					bytes32 dealerHash,
					bytes32 userSeed,
					uint256 bet,
					bytes32 dealerSeed,
					bool win,
					bytes data) returns(bool) {

    // throw if this account has enough money
    // throw if already exists

    /* if(this.balance < msg.value * 3){
	   throw;
    } */
    /* if(games[id].player != address(0)){
      throw;
    } */

    // games[id].player = player;
    // games[id].dealerHash = dealerHash;
    // games[id].userSeed = userSeed;
    // games[id].bet = bet;
	// games[id].dealerSeed = dealerSeed;
	// games[id].playerWin = win;
    // games[id].data = data;

	if(win) {
	  token.transfer(player, bet * 2);
    }
	
    // games[id].finalized = true;

	return true;
  }

  function computeHash(bytes32 _bytes32) pure returns(bytes32){
    return keccak256(_bytes32);
  }

  function finalize(uint id, bytes32 dealerSeed, bool win) {
    /*check if dealerHash == sha3(dealerSeed)*/
    /*check if player has played the game*/
    /*send money to user if modulo == bet*/
    var game = games[id];

    if(game.finalized) {
      throw;
    }
    /* if(game.dealerHash != keccak256(dealerSeed)){ */
    /*   throw; */
    /* } */
    /*if((uint(dealerSeed) + uint(game.userSeed)) % 2 == game.decision){
      msg.sender.transfer(game.bet * 2);
    }
    */
    if(win) {
	  token.transfer(game.player, game.bet * 2);
    }

    game.finalized = true;
  }

}
