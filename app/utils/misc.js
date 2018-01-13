import BigNumber from 'bignumber.js';
import MersenneTwister from 'mersennetwister';



export function fromWei(amtInWei) {
	return BigNumber(amtInWei).dividedBy('1.0e18');
}

export function toWei(amtInEth) {
	return BigNumber(amtInEth).times('1.0e18');
}

// byte32 = hex string of length 64 (exclude prefix '0x')
// hex 2^4, byte 2^8

export function generateRandomString(length=64) {
	var hex = '0x';
	var possible = 'abcdef0123456';

	for (var i = 0; i < length; i++) {
		hex += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return hex;
}


export function keccak256(hex) {
	return web3.utils.soliditySha3(hex);
}


export function getRandom(serverSeed, clientSeed) {
	const intParsedServerSeed = parseInt(serverSeed, 16);
	const intParsedClientSeed = parseInt(clientSeed, 16);
	const seedCombined = intParsedServerSeed + intParsedClientSeed;

	const mt = new MersenneTwister(seedCombined);

	let rv = mt.random() < 0.5 ? 0 : 1;
	return rv;
}



export function reconstructResult(serverSeed, clientSeed) {
	return getRandom(serverSeed, clientSeed);
}
