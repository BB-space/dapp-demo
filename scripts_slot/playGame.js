var Slot = artifacts.require('./Slot.sol');

const accounts = web3.eth.accounts;

function stringToBytes32(str) {
	// cuts last 64 bits from hex if longer
	const hex = web3.fromAscii(str).substr(2);
	return '0x' + hex.substr(-64).padStart(64, '0');
}

module.exports = async function(callback){
  const slot = await Slot.deployed();
	const gameAddress = slot.address;
	const prevPlayerBalance = await web3.eth.getBalance(accounts[0]);
	const prevGameBalance = await web3.eth.getBalance(gameAddress);
	let _hash1 = await slot.getHash.call(0);
	console.log('prevPlayerBalance', prevPlayerBalance);
	console.log('prevGameBalance', prevGameBalance);
	console.log('_hash1', _hash1);
	await slot.initGame(
		_hash1,
		stringToBytes32('myseed'),
		1,
		{ value: web3.toWei(0.25) }
	);
	console.log(
		'after init:',
		'data',
		await slot.getGame(_hash1),
		'betData',
		await slot.getBetLines(_hash1),
		'gameResult',
		await slot.getGameResult(_hash1),
		'playingGames',
		await slot.getPlayingGames(accounts[0])
	);
}
