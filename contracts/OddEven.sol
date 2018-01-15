pragma solidity ^0.4.13;

import './Gamble.sol';
import './GambleToken.sol';


contract OddEven is Gamble {
  address owner;

  struct Game {
    address player;	  
    bytes32 dealerHash;
    bytes32 userSeed;
    uint bet;
    bytes decision;
    bool finalized;
  }
  /* use game id as key of the following mapping*/
  mapping(uint => Game) games;

  modifier onlyowner {
    require(owner == msg.sender);
    _;
  }

  function OddEven() {
    owner = msg.sender;
  }

  function getEther() payable {

  }

  function initGame(uint id,
					address player,
					bytes32 dealerHash,
					bytes32 userSeed,
					uint bet,
					bytes data) returns(bool) {
	
    // throw if this account has enough money
    // throw if already exists

    if(this.balance < msg.value * 3){
      throw;
    }
    if(games[id].player != address(0)){
      throw;
    }
	
    games[id].player = player;
    games[id].dealerHash = dealerHash;
    games[id].userSeed = userSeed;
    games[id].bet = bet;
    games[id].decision = data;
    games[id].finalized = false;

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
    if(game.finalized){
      throw;
    }
    if(game.player != msg.sender){
      throw;
    }

    if(game.dealerHash != keccak256(dealerSeed)){
      throw;
    }
    /*if((uint(dealerSeed) + uint(game.userSeed)) % 2 == game.decision){
      msg.sender.transfer(game.bet * 2);
    }
    */
    if(win) {
      msg.sender.transfer(game.bet * 2);
    }
    game.finalized = true;
  }

}
