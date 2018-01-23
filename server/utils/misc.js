const Web3 = require('web3');
const MersenneTwister = require('mersennetwister');
const BigNumber = require('bignumber.js');
const Tx = require('ethereumjs-tx');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));


function fromWei(amtInWei) {
	return BigNumber(amtInWei).dividedBy('1.0e18');
}

function toWei(amtInEth) {
	return BigNumber(amtInEth).times('1.0e18');
}

function generateRandomString(length=16) {
	var hex = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

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

function makeSignedTransaction(
	wallet,
	privateKey,
	toAddress,
	valueWei,
	nonce,
	txData=''
) {
	privateKey = new Buffer(privateKey.substring(2), 'hex')

	const rawTx = {
		nonce,
		gas: '0x13880',
		gasPrice: '0xe8d4a51000',
		to: toAddress,
		value: web3.utils.numberToHex(valueWei), // in hex
		data: txData
	}

	const tx = new Tx(rawTx);
	tx.sign(privateKey);
	
	const serializedTx = tx.serialize();

	return web3.eth.sendSignedTransaction(
		'0x' + serializedTx.toString('hex')
	);
}


module.exports = {
	fromWei,
	toWei,
	generateRandomString,
	keccak256,
	reconstructResult,
	stringToBytes32,
	makeSignedTransaction
};
