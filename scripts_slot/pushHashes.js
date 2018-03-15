var Slot = artifacts.require('./slot.sol');

function stringToBytes32(str) {
	// cuts last 64 bits from hex if longer
	const hex = web3.fromAscii(str).substr(2);
	return '0x' + hex.substr(-64).padStart(64, '0');
}

const seedsToPush = '11,22,33,44,55,66,77,88,99,100,111,222,333,444,555,666,777,888,999,1111,2222,3333,4444,5555,6666,7777,8888,9999'.split(',');

module.exports = async function(callback){
	const slot = await Slot.deployed();
	const gameAddress = slot.address;
	console.log("gameAddress", gameAddress);

	let hashes = [];
	seedsToPush.forEach(async e => {
		let _seed = stringToBytes32(e)
		let x = await slot.encryptSeeds(stringToBytes32(e));
		console.log('seed',e)
		console.log('seed in bytes', _seed)
		console.log('encrypted Seed', x)
		hashes.push(x);
	});

	let prevLength = await slot.getHashListLength.call();

	console.log('hashes',hashes);
	console.log('prevLength', prevLength.toString());

	await slot.pushHashes(hashes);

	let afterLength = await slot.getHashListLength.call();
	console.log('afterLength', afterLength.toString());
};
