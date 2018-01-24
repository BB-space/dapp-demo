const Web3 = require('web3');
const Tx = require('ethereumjs-tx');


const web3 = new Web3(
	new Web3.providers.WebsocketProvider('ws://localhost:8545')
);

export function makeSignedTransaction(
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
		gasLimit: '0xf4240',  // 1,000,000
		gasPrice: '0x4a817c800',  // 20gwei
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
