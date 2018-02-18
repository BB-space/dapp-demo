pragma solidity ^0.4.13;


contract OddEven {
  address owner;
  bytes32[] hashedDealerSeeds;

  struct Game {
    address player;
    bytes32 playerSeed;
    bytes32 dealerSeed;
    uint bet;
	bool playerWin;
    bool finalized;
	bytes data;
  }
  
  /* use serverSeedHash as key of the following mapping*/
  mapping(bytes32 => Game) games;

  modifier onlyowner {
    require(owner == msg.sender);
    _;
  }

  function OddEven() {
    owner = msg.sender;
  }

  function() payable { }

  
  event PushHashes(bytes32[] hashArray);
  
  function pushHashes(bytes32[] hashArray) onlyowner {
	PushHashes(hashArray);

	for(uint i=0; i<hashArray.length; i++) {
	  // TODO: check if hash is historically already used
	  hashedDealerSeeds.push(hashArray[i]);
	}
  }

  function getHashListLength() returns(uint) {
	return hashedDealerSeeds.length;
  }

  function getHash(uint idx) returns(bytes32) {
	return hashedDealerSeeds[idx];
  }

  function removeHash(uint idx)  returns(uint[]) onlyowner {
	if (idx >= hashedDealerSeeds.length) return;

	for (uint i=idx; i<hashedDealerSeeds.length-1; i++){
	  hashedDealerSeeds[i] = hashedDealerSeeds[i+1];
	}
	delete hashedDealerSeeds[hashedDealerSeeds.length-1];
	hashedDealerSeeds.length--;
	
	return hashedDealerSeeds;
  }

  function indexOf(bytes32 hash) returns(uint) {
    uint i = 0;
    while (values[i] != value && i < hashedDealerSeeds.length) {
      i++;
    }
    return i;
  }

  event InitGame(bytes32 dealerHash,
				 address player,
				 bytes32 playerSeed,
				 bytes data);
  
  function initGame(bytes32 dealerHash,
					address player,
					bytes32 playerSeed,
					bytes data) payable returns(bool) {
	
	InitGame(dealerHash,
			 player,
			 playerSeed,
			 data);
    
    // throw if already exists

	// throw if contract does not have enough money
    /* if(this.balance < msg.value * 3){ */
	/*    throw; */
	/* } */
	
    if(games[dealerHash].player != address(0)){
	   throw;
	}

    games[dealerHash].player = player;
    games[dealerHash].playerSeed = playerSeed;
    games[dealerHash].bet = msg.value;
    games[dealerHash].data = data;

	return true;
  }

  function computeHash(bytes32 _bytes32) pure returns(bytes32){
    return keccak256(_bytes32);
  }

  
  event Finalize(
      bytes32 dealerSeedHash,
	  bytes32 dealerSeed
  );

  function finalize(bytes32 dealerSeedHash, bytes32 dealerSeed) {
    /*check if dealerHash == sha3(dealerSeed)*/
    /*check if player has played the game*/
    /*send money to user if modulo == bet*/
    Finalize(dealerSeedHash, dealerSeed);
	
    var game = games[dealerSeedHash];

    if(game.finalized) {
      throw;
    }
	
    /* if(game.dealerHash != keccak256(dealerSeed)){ */
    /*   throw; */
    /* } */

	
    /* if(win) { */
	/*   msg.sender.transfer(game.bet * 2); */
    /* } */

    game.finalized = true;
  }

}
