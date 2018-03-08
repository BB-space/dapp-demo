pragma solidity ^0.4.13;


contract DSSafeAddSub{
  function safeToAdd(uint a, uint b) internal pure returns(bool){
    return( a + b >= a);
  }
  function safeAdd(uint a, uint b) internal pure returns(uint){
    if(!safeToAdd(a,b)) revert();
    return a + b;
  }
  function safeToSubtract(uint a, uint b) internal pure returns(bool){
    return ( b <= a );
  }
  function safeSub(uint a, uint b) internal pure returns(uint){
    if(!safeToSubtract(a,b)) revert();
    return a - b;
  }
}

contract Utilities{
  function computeMultipleHash(bytes32 _bytes32, uint nTimes) public pure returns(bytes32) {
    bytes32 hash = _bytes32;
    for(uint i=0; i < nTimes; i++) {
      hash = keccak256(hash);
    }
    return hash;
  }
}

contract CLevelAuth{
  // address of c-level accounts
  address ceo;
  address coo;

  modifier onlyCeo {
    require(ceo == msg.sender);
    _;
  }
  modifier onlyCoo {
    require(coo == msg.sender);
    _;
  }
  function changeCeo(address _ceo) public onlyCeo {
    ceo = _ceo;
  }
  function changeCoo(address _coo) public onlyCoo {
    coo = _coo;
  }
}

contract GRC is DSSafeAddSub{
  //betTable in BP
  //betTable & logic for 1 * 3 slot only
  function computeReward(uint betAmount, uint betLines, uint[] gameResult) public pure returns(uint){
    // TODO: add logic
    //to remove linter error
    return betAmount * betLines * gameResult[0];
    //return unitRewardInBp
  }
  function computeDeposit(uint betAmount, uint betLines) public pure returns(uint){
    // TODO: add logic
    return betLines * betAmount / 10000;
  }

}

contract OddEven is DSSafeAddSub, Utilities, CLevelAuth, GRC{
/*
states
*/
  // struct that contains information of each betting
    // player : address of betting account
    // playerSeed : a seed that is provided from player
    // serverSeed : a seed that is provided from server
    // bet : bet amount in Wei (ether * 10^-18)
    // betBlockHeight : the betBlockHeight
    // reward : flag, unit Reward for the bet
    // finalized : flag, whether the server finalized user according to the game result
    // betLines : all the information of bet (exclude bet amount)
  struct Game {
    address player;
    bytes32 playerSeed;
    bytes32 serverSeed;
    uint bet;
    uint betBlockHeight;
    uint depositForBet;
    uint reward;
    bool finalized;
    uint betLines;
    uint[] gameResult;
  }
  // deposit : total amount of deposit
  uint deposit;
  // reelNum: number of reel
  // hashNum: number of hashing
  // blockTerm : users can claim their bets if currentBlocktHeight > betBlockHeight + blockTerm
  // reelSymbolNum : how many symbols in each reel
  // edge : edge in bp (100bp = 1%)
  uint reelNum;
  uint maxHashNum;
  uint blockTerm;
  uint reelSymbolNum;
  uint edge;
  /* // address of c-level accounts
  address ceo;
  address coo; */
  // array of serverHashs, player can bet only through a hash from the array
  bytes32[] serverHashs;
  // use serverSeedHash as key of each games
  mapping(bytes32 => Game) games;
  // maps player and playing games (not played)
  mapping(address => bytes32[]) playingGames;
  // c-level autority modifiers
  /* modifier onlyCeo {
    require(ceo == msg.sender);
    _;
  }
  modifier onlyCoo {
    require(coo == msg.sender);
    _;
  } */
/*
contract constructor
*/
  function OddEven() public {
    //set c-level accounts
    ceo = msg.sender;
    coo = msg.sender;
    //set default contract variables
    setReelNum(3);
    setHashNum(4);
    setReelSymbolNum(6);
    setEdge(100);
    //odd, even
    //tripple 1, tripple 2, tripple 3, tripple 4, tripple 5, tripple 6
    //1,2,3,4,5,6
    //3 to 10, 11 to 18
    deposit = 0;
  }
  /* make contract payable */
  function() public payable{

  }
/*
/*
autority related functions
*/
  /* function changeCeo(address _ceo) public onlyCeo {
    ceo = _ceo;
  }
  function changeCoo(address _coo) public onlyCoo {
    coo = _coo;
  } */
  function setReelNum(uint _reelNum) public onlyCoo{
    reelNum = _reelNum;
  }
  function setHashNum(uint _maxHashNum) public onlyCoo{
    //assert(_maxHashNum > reelNum + 1);
    maxHashNum = _maxHashNum;
  }
  function setReelSymbolNum(uint _reelSymbolNum) public onlyCoo{
    reelSymbolNum = _reelSymbolNum;
  }
  function setEdge(uint _edge) public onlyCoo{
    edge = _edge;
  }
/*
hash related functions
*/
  event PushHashes (bytes32[] hashArray);

  function pushHashes (bytes32[] hashArray) public onlyCoo {
    PushHashes(hashArray);
    bool notInFlag;
    for(uint i=0; i<hashArray.length; i++) {
      if(games[hashArray[i]].player == address(0)){
        notInFlag = true;
        for(uint j=0; j<serverHashs.length; j++){
          notInFlag = notInFlag && serverHashs[j] != hashArray[i];
        }
        if(notInFlag){
          serverHashs.push(hashArray[i]);
        }
      }
    }
  }

  function getHashListLength() public constant returns(uint) {
    return serverHashs.length;
  }

  function getHash(uint idx) public constant returns(bytes32) {
    return serverHashs[idx];
  }

  function encryptSeeds(bytes32 _string) public view returns(bytes32){
    return computeMultipleHash(_string, maxHashNum);
  }
/*
betting related functions
*/
  //event occurs only when initGame function is called
  event InitGame(
    bytes32 serverHash,
    address player,
    bytes32 playerSeed,
    uint betLines
  );

  //betting function
    //input definition is exactly same as attributes of Game struct
  function initGame(
    bytes32 serverHash,
    bytes32 playerSeed,
    uint betLines
  ) public payable returns(bool) {

  //exception1 : player choose pre-picked serverSeedHash
  //exception2 : player sends invalid serverSeedHash
  //exception3 : contranct has not enough ether
    //exception1
    if(games[serverHash].player != address(0)) {
      revert();
    }
    //exception2
    uint serverHashIdx = indexOfserverHash(serverHash);
    if(serverHashIdx == serverHashs.length) {
      revert();
    }
    //exception3
    uint depositForBet = computeDeposit(msg.value, betLines);
    if(this.balance < safeAdd(depositForBet, deposit)){
      revert();
    }

  //fire event
    address player = msg.sender;
    InitGame(
      serverHash,
      player,
      playerSeed,
      betLines
    );
  //update games array
    games[serverHash].player = player;
    games[serverHash].playerSeed = playerSeed;
    games[serverHash].bet = msg.value;
    games[serverHash].betLines = betLines;
    games[serverHash].betBlockHeight = block.number - 1;
    games[serverHash].depositForBet = depositForBet;
  //update deposit
    deposit = safeAdd(deposit,depositForBet);
    removeHashFromHashedDealerSeeds(serverHashIdx);
    playingGames[player].push(serverHash);
    return true;
  }

  /*
  finalize related functions
  */
  event Finalize(
    bytes32 serverHash,
    bytes32 serverSeed,
    bytes32 clientSeed,
    uint reward
  );
  function finalize(bytes32 serverHash, bytes32 serverSeed) public onlyCoo{
    //check if has played the game
    //send money to user if modulo == bet
    var game = games[serverHash];
    if(encryptSeeds(serverSeed) != serverHash){
      revert();
    }
    if(game.player == address(0)){
      revert();
    }
    if(game.finalized){
      revert();
    }
    game.serverSeed = serverSeed;
    setResult(
      serverHash,
      serverSeed,
      game.playerSeed
    );
    uint reward = computeReward(
      game.bet,
      game.betLines,
      game.gameResult
    );
    Finalize(
      serverHash,
      serverSeed,
      game.playerSeed,
      reward
    );
    game.reward = reward;
    removePlayedGame(reward, game.player, serverHash);
  }

  function setResult(bytes32 serverHash, bytes32 serverSeed, bytes32 playerSeed) private onlyCoo{
    var gameResult = games[serverHash].gameResult;
    for(uint i = 0; i < reelNum; i++){
      bytes32 reelHash = keccak256(
        computeMultipleHash(serverSeed, maxHashNum - 1 - i),
        playerSeed
      );
      gameResult.push(uint(reelHash) % reelSymbolNum);
    }
  }

  function removePlayedGame(uint reward, address player, bytes32 serverSeedHash) private{
    player.transfer(reward);
    deposit = safeSub(deposit, reward);
    games[serverSeedHash].finalized = true;
    uint idx = indexOfPlayingGame(serverSeedHash, player);
    removeHashFromPlayingGames(idx, player);
  }

  function sendMoney(uint _money) public onlyCeo{
    ceo.transfer(_money);
  }

  function sendMoney(address _address, uint _money) public onlyCeo{
    _address.transfer(_money);
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
logging
*/
  function getGame(bytes32 _serverHash) public view returns(
    address player,
    bytes32 playerSeed,
    bytes32 serverSeed,
    uint bet,
    uint betBlockHeight,
    uint depositForBet,
    uint reward,
    bool finalized
  ){
    var game = games[_serverHash];
    player = game.player;
    playerSeed = game.playerSeed;
    serverSeed = game.serverSeed;
    bet = game.bet;
    betBlockHeight = game.betBlockHeight;
    depositForBet = game.depositForBet;
    reward = game.reward;
    finalized = game.finalized;
  }
  function getbetLines(bytes32 _serverHash) public view returns(
    uint betLines
  ){
    var game = games[_serverHash];
    betLines = game.betLines;
  }
  function getGameResult(bytes32 _serverHash) public view returns(
    uint[] gameResult
  ){
    var game = games[_serverHash];
    gameResult = game.gameResult;
  }
  function getPlayingGames(address _player) public view returns(
    bytes32[] _playingGames
  ){
    _playingGames = playingGames[_player];
  }
  //test sha3
  function _setResult(bytes32 serverSeed, bytes32 playerSeed) public view returns(
    bytes32 reel1hash,
    bytes32 reel2hash,
    bytes32 reel3hash,
    uint _maxHashNum,
    uint _reelSymbolNum,
    uint reel1raw,
    uint reel2raw,
    uint reel3raw,
    uint reel1,
    uint reel2,
    uint reel3
  ){
    reel1hash = keccak256(
      computeMultipleHash(serverSeed,1),
      playerSeed
    );
    reel2hash = keccak256(
      computeMultipleHash(serverSeed,2),
      playerSeed
    );
    reel3hash = keccak256(
      computeMultipleHash(serverSeed,3),
      playerSeed
    );
    _maxHashNum = maxHashNum;
    _reelSymbolNum = reelSymbolNum;
    reel1raw = uint(reel1hash);
    reel2raw = uint(reel2hash);
    reel3raw = uint(reel3hash);
    reel1 = reel1raw % reelSymbolNum;
    reel2 = reel2raw % reelSymbolNum;
    reel3 = reel3raw % reelSymbolNum;
  }
/*
utilities
*/
  function indexOfserverHash(bytes32 _hash) public constant returns(uint) {
    uint i = 0;

    while (
      serverHashs[i] != _hash
      && i < serverHashs.length
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
    if (idx < serverHashs.length){
      for (uint i=idx; i<serverHashs.length-1; i++){
        serverHashs[i] = serverHashs[i+1];
      }
      delete serverHashs[serverHashs.length-1];
      serverHashs.length--;
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
}
