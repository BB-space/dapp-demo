const Web3 = require('web3');
const MersenneTwister = require('mersennetwister');
const BigNumber = require('bignumber.js')

const web3 = new Web3();


function fromWei(amtInWei) {
	return BigNumber(amtInWei).dividedBy('1.0e18');
}

function toWei(amtInEth) {
	return BigNumber(amtInEth).times('1.0e18');
}

function generateRandomString(length=64) {
	var hex = '0x';
	var possible = 'abcdef0123456';
	for (var i = 0; i < length; i++) {
		hex += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return hex;
}


function keccak256(hex) {
	return web3.utils.soliditySha3(hex);
}


function reconstructResult(serverSeed, clientSeed) {
	serverSeed = BigNumber(web3.utils.asciiToHex(serverSeed), 16);
	clientSeed = BigNumber(web3.utils.asciiToHex(clientSeed), 16);
	let seedsCombined = serverSeed.plus(clientSeed);

	seedsCombined = seedsCombined
		.toString(16)
		.match(/.{1,3}/g)
		.map(str => parseInt(str, 16));
	
	const mt = new MersenneTwister();
	mt.seedArray(seedsCombined);

	return mt.random() < 0.5 ? 0 : 1;
}


function stringToBytes32(str) {
	// cuts last 64 bits from hex if longer
	const hex = web3.utils.asciiToHex(str).substr(2);
	return '0x' + hex.substr(-64).padStart(64, '0');
}


module.exports = {
	fromWei,
	toWei,
	generateRandomString,
	keccak256,
	reconstructResult,
	stringToBytes32
};
