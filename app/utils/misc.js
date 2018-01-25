import BigNumber from 'bignumber.js';
import MersenneTwister from 'mersennetwister';
import Web3 from 'web3';

const web3 = new Web3();


export function fromWei(amtInWei) {
	return BigNumber(amtInWei).dividedBy('1.0e18');
}

export function toWei(amtInEth) {
	return BigNumber(amtInEth).times('1.0e18');
}

// byte32 = hex string of length 64 (exclude prefix '0x')
// hex 2^4, byte 2^8

/* export function generateRandomString(length=64) {
 * 	var hex = '0x';
 * 	var possible = 'abcdef0123456';
 * 
 * 	for (var i = 0; i < length; i++) {
 * 		hex += possible.charAt(Math.floor(Math.random() * possible.length));
 * 	}
 * 
 * 	return hex;
 * }*/

export function generateRandomString(length=16) {
	var hex = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

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
	//overflow 떠서 항상 result를 1로 반환하는 것 같음 아래와 같이 처리
	const seedCombined = (intParsedServerSeed + intParsedClientSeed)%10000;
	const mt = new MersenneTwister(seedCombined);

	let rv = mt.random() < 0.5 ? 0 : 1;
	return rv;
}

export function reconstructResult(serverSeed, clientSeed) {
	serverSeed = BigNumber(web3.utils.asciiToHex(serverSeed), 16);
	clientSeed = BigNumber(web3.utils.asciiToHex(clientSeed), 16);
	let seedsCombined = serverSeed.plus(clientSeed);

	seedsCombined = seedsCombined
		.toString(16)
		.match(/.{1,3}/g)
		.map(str => parseInt(str, 16));
	
	const mt = new MersenneTwister();
	mt.seedArray(seedsCombined);

	return [
		Math.floor(mt.random() * 6) + 1,
		Math.floor(mt.random() * 6) + 1,
		Math.floor(mt.random() * 6) + 1
	];
}

export function asciiToHex(str) {
	return web3.utils.asciiToHex(str);
}

export function stringToBytes32(str) {
	// cuts last 64 bits from hex if longer
	const hex = asciiToHex(str).substr(2);
	return '0x' + hex.substr(-64).padStart(64, '0');
}
