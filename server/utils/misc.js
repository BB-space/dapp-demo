const Web3 = require('web3');
const MersenneTwister = require('mersenne-twister');

const web3 = new Web3();


function generateRandomHex(length=16) {
	var hex = '';
	var possible = '0123456789abcdef';

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

module.exports = {
	generateRandomHex,
	keccak256,
	getRandom
};
