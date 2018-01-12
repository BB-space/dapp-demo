const Web3 = require('web3');
const MersenneTwister = require('mersennetwister');
const BigNumber = require('bignumber.js')

const web3 = new Web3();


function generateRandomString(length=16) {
	var hex = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

	for (var i = 0; i < length; i++) {
		hex += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return hex;
}


function keccak256(str) {
	return web3.utils.keccak256(str);
}


function getRandom(serverSeed, clientSeed) {
	const seedCombined = parseInt(serverSeed, 16) + parseInt(clientSeed, 16);
	const mt = new MersenneTwister();

	mt.init_seed(seedCombined);
	return mt.random() < 0.5 ? 0 : 1;
}


function reconstructResult(serverSeed, clientSeed) {
	serverSeed = BigNumber(web3.utils.asciiToHex(serverSeed), 16);
	clientSeed = BigNumber(web3.utils.asciiToHex(clientSeed), 16);
	let seedsCombined = serverSeed.plus(clientSeed);

	seedsCombined = seedsCombined
		.toString(16)
		.match(/.{1,3}/g)
		.maph(str => parseInt(str, 16));
	
	const mt = new MersenneTwister();
	mt.seedArray(seedsCombined);

	return mt.random() < 0.5 ? 0 : 1;
}


module.exports = {
	generateRandomString,
	keccak256,
	reconstructResult
};
