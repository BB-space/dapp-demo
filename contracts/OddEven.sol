pragma solidity ^0.4.13;


contract OddEven {
/*
states
*/
  // struct that contains information of each betting
    // player : address of betting account
    // playerSeed : a seed that is provided from player
    // dealerSeed : a seed that is provided from dealer
    // bet : bet amount in Wei (ether * 10^-18)
    // betBlockHeight : the betBlockHeight
    // playerWin : flag, whether the player has won or not
    // finalized : flag, whether the dealer finalized user according to the game result
    // betData : all the information of bet (exclude bet amount)
  struct Game {
    address player;
    bytes32 playerSeed;
    bytes32 dealerSeed;
    uint bet;
    uint betBlockHeight;
    uint depositForBet;
    bool playerWin;
    bool finalized;
    uint[] betData;
    uint[] gameResult;
  }
  // safety factor that forces contract to deposit multiple of maxium reward
  // ex ) if a player bet with 3ETH and the maximum reward would be 9ETH then contract should deposit 9ETH * depositConstant
  uint depositConstant;
  // deposit : total amount of deposit
  uint deposit;
  // diceNum: number of dice
  // hashNme: number of hashing
  // blockTerm : users can claim their bets if currentBlocktHeight > betBlockHeight + blockTerm
  // diceFaces : how many faces in each dice
  // edge : edge in bp (100bp = 1%)
  uint diceNum;
  uint maxHashNum;
  uint blockTerm;
  uint diceFaces;
  uint edge;
  // address of c-level accounts
  address ceo;
  address coo;
  // array of hashedDealerSeeds, player can bet only through a hash from the array
  bytes32[] hashedDealerSeeds;
  // use serverSeedHash as key of each games
  mapping(bytes32 => Game) games;
  // maps player and playing games (not played)
  mapping(address => bytes32[]) playingGames;
  mapping(uint => uint) betTable;
  // c-level autority modifiers
  modifier onlyCeo {
    require(ceo == msg.sender);
    _;
  }
  modifier onlyCoo {
    require(coo == msg.sender);
    _;
  }
/*
contract constructor
*/
  function OddEven() public{
    //set c-level accounts
    ceo = msg.sender;
    coo = msg.sender;
    //set default contract variables
    setDiceNum(3);
    setHashNum(40);
    setDepositConstant(3);
    setDiceFaces(8);
    setEdge(100);
  }
  /* make contract payable */
  function() payable public{

  }
/*
/*
autority related functions
*/
  function changeCeo(address _ceo) public onlyCeo {
    ceo = _ceo;
  }
  function changeCoo(address _coo) public onlyCoo {
    coo = _coo;
  }
  function setDiceNum(uint _diceNum) public onlyCoo{
    diceNum = _diceNum;
  }
  function setHashNum(uint _maxHashNum) public onlyCoo{
    assert(_maxHashNum < diceNum + 1);
    maxHashNum = _maxHashNum;
  }
  function setDepositConstant(uint _depositConstant) public onlyCoo{
    depositConstant = _depositConstant;
  }
  function setDiceFaces(uint _diceFaces) public onlyCoo{
    diceFaces = _diceFaces;
  }
  function setEdge(uint _edge) public onlyCoo{
    edge = _edge;
  }
/*
hash related functions
*/
  event PushHashes (bytes32[] hashArray);

  function pushHashes (bytes32[] hashArray) public onlyCeo {
    PushHashes(hashArray);

    for(uint i=0; i<hashArray.length; i++) {
      // TODO: check if hash is historically already useds
      hashedDealerSeeds.push(hashArray[i]);
    }
  }

  function getHashListLength() public constant returns(uint) {
    return hashedDealerSeeds.length;
  }

  function getHash(uint idx) public constant returns(bytes32) {
    return hashedDealerSeeds[idx];
  }
/*
betting related functions
*/
  //event occurs only when initGame function is called
  event InitGame(
    bytes32 dealerHash,
    address player,
    bytes32 playerSeed,
    uint[] betData
  );
  //betting function
    //input definition is exactly same as attributes of Game struct
  function initGame(
    bytes32 dealerHash,
    bytes32 playerSeed,
    uint[] betData
  ) public payable returns(bool) {

  //exception1 : player choose pre-picked serverSeedHash
  //exception2 : player sends invalid serverSeedHash
  //exception3 : contranct has not enough ether
    //exception1
    if(games[dealerHash].player != address(0)) {
      revert();
    }
    //exception2
    uint dealerHashIdx = indexOfhashedDealerSeed(dealerHash);
    if(dealerHashIdx == hashedDealerSeeds.length) {
      revert();
    }
    //exception3
    uint depositForBet = computeDeposit(msg.value, betData);
    if(this.balance - deposit < depositForBet){
      revert();
    }

  //fire event
    address player = msg.sender;
    InitGame(
      dealerHash,
      player,
      playerSeed,
      betData
    );
  //update games array
    games[dealerHash].player = player;
    games[dealerHash].playerSeed = playerSeed;
    games[dealerHash].bet = msg.value;
    games[dealerHash].betData = betData;
    games[dealerHash].betBlockHeight = block.number - 1;
    games[dealerHash].depositForBet = depositForBet;
  //update deposit
    deposit += depositForBet;
    removeHashFromHashedDealerSeeds(dealerHashIdx);
    return true;
  }
  // function for compute Deposit for each bet
  function computeDeposit(uint betAmount, uint[] betData) public view returns(uint){
    // TODO: calculate maxbet for each bet
    return betAmount * computeUnitReward(betData);
  }


  /*
  finalize related functions
  */
  event Finalize(
    bytes32 hashedDealerSeed,
    bytes32 dealerSeed
  );

  function finalize(bytes32 hashedDealerSeed, bytes32 dealerSeed) public onlyCoo {
    //check if has played the game
    //send money to user if modulo == bet
    var game = games[hashedDealerSeed];

    assert(computeMultipleHash(dealerSeed, maxHashNum) == hashedDealerSeed);
    assert(game.player != address(0));
    assert(!game.finalized);

    Finalize(hashedDealerSeed, dealerSeed);
    game.dealerSeed = dealerSeed;
    setResult(
      hashedDealerSeed,
      dealerSeed,
      game.playerSeed
    );
    uint unitReward = computeUnitReward(
      game.betData,
      hashedDealerSeed
    );
    removePlayedGame(unitReward * game.bet, game.player, hashedDealerSeed);
  }

  function setResult(bytes32 hashedDealerSeed, bytes32 dealerSeed, bytes32 playerSeed) private onlyCoo{
    var gameResult = games[hashedDealerSeed].gameResult;
    for(uint i = 0; i < diceNum; i++){
      bytes32 serverDiceHash = keccak256(
        computeMultipleHash(dealerSeed, maxHashNum - 1 - i),
        playerSeed
      );
      gameResult.push(uint(serverDiceHash) % diceNum);
    }
  }

  function computeUnitReward(uint[] betData) public view returns(uint){
    uint reward = 0;
    uint betWeightSum = 0;
    for(uint i = 0 ; i < betData.length/2; i++){
      uint betWeight = betData[2*i+1];
      reward += betTable[i] * betWeight;
      betWeightSum += betWeight;
    }
    return reward / betWeightSum;
  }

  function computeUnitReward(uint[] betData, bytes32 hashedDealerSeed) public view returns(uint){
    var gameResult = games[hashedDealerSeed].gameResult;
    uint reward = 0;
    uint betWeightSum = 0;
    uint sumOfDice = 0;
    for(uint i = 0; i < gameResult.length; i++){
      sumOfDice += gameResult[i];
    }
    for(uint j = 0; j < betData.length/2; j++){
      uint betSide = betData[2*j];
      uint betWeight = betData[2*j+1];
      betWeightSum += betWeight;
      // if even
      if( betSide == 0 && sumOfDice % 2 == 0){
        reward += betTable[0] * betWeight;
      // if odd
      }else if( betSide == 1 && sumOfDice % 2 == 1){
        reward += betTable[1] * betWeight;
      }
    }
    return reward / betWeightSum * (10000 - edge)/10000;
  }

  function removePlayedGame(uint reward, address player, bytes32 serverSeedHash) private {
    player.transfer(reward);
    deposit -= reward;
    games[serverSeedHash].finalized = true;
    uint idx = indexOfPlayingGame(serverSeedHash, player);
    removeHashFromPlayingGames(idx, player);
  }
/*
prevention of avoiding finalization related functions
(to guarantee 100% finalization)
*/
  function claimAll() public{
    address player = msg.sender;
    uint playingGamesNum = playingGames[player].length;
    for(uint i = 0; i < playingGamesNum; i++){
      bytes32 _hash = playingGames[player][i];
      if (block.number > games[_hash].betBlockHeight + blockTerm){
        uint prevDeposit = games[_hash].depositForBet;
        removePlayedGame(prevDeposit, player, _hash);
      }
    }
  }
/*
utilities
*/
  function indexOfhashedDealerSeed(bytes32 _hash) public constant returns(uint) {
    uint i = 0;

    while (
      hashedDealerSeeds[i] != _hash
      && i < hashedDealerSeeds.length
    ) {
      i++;
    }
    return i;
  }
  function indexOfPlayingGame(bytes32 _hash, address player) public constant returns(uint) {
    uint i = 0;
    while(
      playingGames[player][i] != _hash
      && i < playingGames[player].length
    ){
      i++;
    }
    return i;
  }
  function removeHashFromHashedDealerSeeds(uint idx) private {
    if (idx < hashedDealerSeeds.length){
      for (uint i=idx; i<hashedDealerSeeds.length-1; i++){
        hashedDealerSeeds[i] = hashedDealerSeeds[i+1];
      }
      delete hashedDealerSeeds[hashedDealerSeeds.length-1];
      hashedDealerSeeds.length--;
    }
  }
  function removeHashFromPlayingGames(uint idx, address player) private {
    if (idx < playingGames[player].length){
      for(uint i = idx; i < playingGames[player].length - 1; i++){
        playingGames[player][i] = playingGames[player][i+1];
      }
      delete playingGames[player][playingGames[player].length - 1];
      playingGames[player].length--;
    }
  }
  function computeMultipleHash(bytes32 _bytes32, uint nTimes) public pure returns(bytes32) {
    bytes32 hash = _bytes32;
    for(uint i=0; i < nTimes; i++) {
      hash = keccak256(hash);
    }
    return hash;
  }
}
