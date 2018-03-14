var Slot = artifacts.require('./Slot.sol');

function stringToBytes32(str) {
	// cuts last 64 bits from hex if longer
	const hex = web3.fromAscii(str).substr(2);
	return '0x' + hex.substr(-64).padStart(64, '0');
}

const accounts = web3.eth.accounts;
var serverSeed = '11';
var _serverSeed = stringToBytes32(serverSeed);
var targetAccount = accounts[0];

module.exports = async function(callback){
  const slot = await Slot.deployed();
	const gameAddress = slot.address;
	const hashes = await slot.getPlayingGames(targetAccount);
  const encryptedSeed = await slot.encryptSeeds(_serverSeed);
	console.log('seed',serverSeed)
	console.log('seed in bytes32', _serverSeed)
	console.log("encrypted Seed", encryptedSeed);
  for (var idx in hashes) {
		const _hash = hashes[idx]
		console.log("hash",_hash);
    if(_hash == encryptedSeed){
			console.log('start finalize')
      await slot.finalize(_hash, _serverSeed);
			console.log('end finalize')
    	console.log(
    		'after finalize:',
    		'data',
    		await slot.getGame(_hash),
    		'betData',
    		await slot.getBetLines(_hash),
    		'gameResult',
    		await slot.getGameResult(_hash),
    		'playingGames',
    		await slot.getPlayingGames(accounts[0])
    	);
    	const afterPlayerBalance = await web3.eth.getBalance(accounts[0]);
    	const afterGameBalance = await web3.eth.getBalance(gameAddress);
    	console.log('nextPlayerBalance', afterPlayerBalance);
    	console.log('nextGameBalance', afterGameBalance);
    }
  }
}
