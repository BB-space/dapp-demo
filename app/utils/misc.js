import BigNumber from 'bignumber.js';
import MersenneTwister from 'mersenne-twister';



export function fromWei(amtInWei) {
	return BigNumber(amtInWei).dividedBy('1.0e18');
}

export function toWei(amtInEth) {
	return BigNumber(amtInEth).times('1.0e18');
}

export function generateRandomHex(length=16) {
	var hex = '';
	var possible = '0123456789abcdef';

	for (var i = 0; i < length; i++) {
		hex += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return hex;
}

export function keccak256(str) {
	return web3.utils.keccak256(str);
}

export function getRandom(serverSeed, clientSeed) {
	const seedCombined = parseInt(serverSeed, 16) + parseInt(clientSeed, 16);
	const mt = new MersenneTwister();

	mt.init_seed(seedCombined);
	return mt.random() < 0.5 ? 0 : 1;
}
