import BigNumber from 'bignumber.js';
import MersenneTwister from 'mersennetwister';



export function fromWei(amtInWei) {
	return BigNumber(amtInWei).dividedBy('1.0e18');
}

export function toWei(amtInEth) {
	return BigNumber(amtInEth).times('1.0e18');
}

export function generateRandomString(length=16) {
	var hex = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

	for (var i = 0; i < length; i++) {
		hex += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return hex;
}

export function keccak256(str) {
	return web3.utils.keccak256(str);
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

	return mt.random() < 0.5 ? 0 : 1;
}
