var Slot = artifacts.require('./Slot.sol');

function stringToBytes32(str) {
	// cuts last 64 bits from hex if longer
	const hex = web3.fromAscii(str).substr(2);
	return '0x' + hex.substr(-64).padStart(64, '0');
}

const accounts = web3.eth.accounts;
var targetAccount = accounts[0];

const serverSeeds = '11,22,33,44,55,66,77,88,99,100,111,222,333,444,555,666,777,888,999,1111,2222,3333,4444,5555,6666,7777,8888,9999'.split(',');

module.exports = async function(callback){
  const slot = await Slot.deployed();
	const gameAddress = slot.address;
	const hashes = await slot.getPlayingGames(targetAccount);
	serverSeeds.forEach(async serverSeed => {
		var _serverSeed = stringToBytes32(serverSeed);
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
	    		await slot.getPlayingGames(accounts[0]),
					'reward',
					await slot.getGameReward(_hash)
	    	);
	    	const afterPlayerBalance = await web3.eth.getBalance(accounts[0]);
	    	const afterGameBalance = await web3.eth.getBalance(gameAddress);
	    	console.log('nextPlayerBalance', afterPlayerBalance);
	    	console.log('nextGameBalance', afterGameBalance);
	    }
	  }
	});
}
