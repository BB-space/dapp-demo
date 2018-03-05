var OddEven = artifacts.require('./OddEven.sol');

function stringToBytes32(str) {
	// cuts last 64 bits from hex if longer
	const hex = web3.fromAscii(str).substr(2);
	return '0x' + hex.substr(-64).padStart(64, '0');
}

const seedsToPush = '1234567890qwertyuiopasdfghjklzxcvbnm'.split('');

module.exports = async function(callback){
	const oddEven = await OddEven.deployed();
	const gameAddress = oddEven.address;
	console.log("gameAddress", gameAddress);

	let hashes = [];
	seedsToPush.forEach(async e => {
		let x = await oddEven.encryptSeeds(stringToBytes32(e));
		hashes.push(x);
	});
	
	let prevLength = await oddEven.getHashListLength.call();
	
	console.log('hashes',hashes);
	console.log('prevLength', prevLength.toString());
	
	await oddEven.pushHashes(hashes);
	
	let afterLength = await oddEven.getHashListLength.call();
	console.log('afterLength', afterLength.toString());
};
