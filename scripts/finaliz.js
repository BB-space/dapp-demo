var OddEven = artifacts.require('./OddEven.sol');

function stringToBytes32(str) {
	// cuts last 64 bits from hex if longer
	const hex = web3.toHex(str).substr(2);
	return '0x' + hex.substr(-64).padStart(64, '0');
}

const accounts = web3.eth.accounts;

var serverSeed = stringToBytes32('strong');
var targetAccount = accounts[0];

module.exports = async function(callback){
  const oddEven = await OddEven.deployed();
	const gameAddress = oddEven.address;
	const hashes = await oddEven.getPlayingGames(targetAccount);
  const encryptedSeed = await oddEven.encryptSeeds(serverSeed);
	console.log("encrypted Seed", encryptedSeed);
  for (var idx in hashes) {
		const _hash = hashes[idx]
		console.log("hash",_hash);
    if(_hash == encryptedSeed){
      await oddEven.finalize(_hash, serverSeed);
    	console.log(
    		'after finalize:',
    		'data',
    		await oddEven.getGame(_hash),
    		'betData',
    		await oddEven.getBetData(_hash),
    		'gameResult',
    		await oddEven.getGameResult(_hash),
    		'playingGames',
    		await oddEven.getPlayingGames(accounts[0])
    	);
    	const afterPlayerBalance = await web3.eth.getBalance(accounts[0]);
    	const afterGameBalance = await web3.eth.getBalance(gameAddress);
    	console.log('nextPlayerBalance', afterPlayerBalance);
    	console.log('nextGameBalance', afterGameBalance);
    }
  }
}
