var OddEven = artifacts.require('./OddEven.sol');

const accounts = web3.eth.accounts;

function stringToBytes32(str) {
	// cuts last 64 bits from hex if longer
	const hex = web3.fromAscii(str).substr(2);
	return '0x' + hex.substr(-64).padStart(64, '0');
}

module.exports = async function(callback){
  const oddEven = await OddEven.deployed();
	const gameAddress = oddEven.address;
	const prevPlayerBalance = await web3.eth.getBalance(accounts[0]);
	const prevGameBalance = await web3.eth.getBalance(gameAddress);
	let _hash1 = await oddEven.getHash.call(1);
	console.log('prevPlayerBalance', prevPlayerBalance);
	console.log('prevGameBalance', prevGameBalance);
	await oddEven.initGame(
		_hash1,
		stringToBytes32('myseed'),
		[
			1,10,
			4,10,
			12,5
		],
		{ value: web3.toWei(0.25) }
	);
	console.log(
		'after init:',
		'data',
		await oddEven.getGame(_hash1),
		'betData',
		await oddEven.getBetData(_hash1),
		'gameResult',
		await oddEven.getGameResult(_hash1),
		'playingGames',
		await oddEven.getPlayingGames(accounts[0])
	);
}
