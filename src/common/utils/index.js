import BigNumber from 'bignumber.js';
import _ from 'lodash';
import Web3 from 'web3';


const web3 = new Web3();


export const isBrowser = new Function(
    'try {return this===window;}catch(e){ return false;}'
);

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

export function keccak256(hex) {
	return web3.utils.soliditySha3({type:'bytes32', value: hex});
}

export function stringToBytes32(str) {
	// cuts last 64 bits from hex if longer
	const hex = web3.utils.asciiToHex(str).substr(2);
	return '0x' + hex.substr(-64).padStart(64, '0');
}

export function bytesToString(bytes) {
	return web3.utils.toAscii(bytes);
}

export function computeMultipleHash(str, nTimes) {
	let hash = str;
	for (var i=0; i<nTimes; i++){
		hash = keccak256(hash);
	}
	return hash;
}

export function reconstructResult(
	_serverSeed,
	_clientSeed,
	convertToBytes=true
) {
	let serverSeed = _serverSeed;
	let clientSeed = _clientSeed;
	
	if(convertToBytes) {
		serverSeed = stringToBytes32(_serverSeed);
		clientSeed = stringToBytes32(_clientSeed);
	}
	
	const dice3hash = web3.utils.soliditySha3(
		{type:'bytes32',value:computeMultipleHash(serverSeed,3)},
		{type:'bytes32',value:clientSeed}
	);
	const dice2hash = web3.utils.soliditySha3(
		{type:'bytes32',value:computeMultipleHash(serverSeed,2)},
		{type:'bytes32',value:clientSeed}
	);
	const dice1hash = web3.utils.soliditySha3(
		{type:'bytes32',value:computeMultipleHash(serverSeed,1)},
		{type:'bytes32',value:clientSeed}
	);
	
	const dice1NumberRaw = BigNumber(dice1hash);
	const dice2NumberRaw = BigNumber(dice2hash);
	const dice3NumberRaw = BigNumber(dice3hash);

	const dice1Number = Number(dice1NumberRaw.modulo(16));
	const dice2Number = Number(dice2NumberRaw.modulo(16));
	const dice3Number = Number(dice3NumberRaw.modulo(16));
	
	return [
		dice1Number,
		dice2Number,
		dice3Number
	];

}
