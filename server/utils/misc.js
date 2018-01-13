const Web3 = require('web3');
const MersenneTwister = require('mersennetwister');
const BigNumber = require('bignumber.js')

const web3 = new Web3();


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


function getRandom(serverSeed, clientSeed) {
	const intParsedServerSeed = parseInt(serverSeed, 16);
	const intParsedClientSeed = parseInt(clientSeed, 16);
	const seedCombined = intParsedServerSeed + intParsedClientSeed;

	const mt = new MersenneTwister(seedCombined);

	let rv = mt.random() < 0.5 ? 0 : 1;
	return rv;
}


function reconstructResult(serverSeed, clientSeed) {
	return getRandom(serverSeed, clientSeed);
}


module.exports = {
	generateRandomString,
	keccak256,
	reconstructResult
};
