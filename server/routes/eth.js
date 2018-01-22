const Router	= require('koa-router'),
	  Web3		= require('web3'),
	  Tx		= require('ethereumjs-tx');


const router = new Router();
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const BASE_URL = '/api/eth';


router.get(`${BASE_URL}/balance`, async (ctx) => {
	const reqBody = ctx.request.body;
	const user = ctx.state.user;
	const {
		wallet,
		private_key
	} = user;

	console.log(wallet, private_key);

	if (!ctx.isAuthenticated()) {
		ctx.body = { status: 'not logged in' }
		return false;
	}

	const ethBalance = await web3.eth.getBalance(wallet);


	var privateKey = new Buffer(private_key.substring(2), 'hex')

	var rawTx = {
		nonce: 6,
		gasLimit: '0x5208',
		to: '0x7153705eF9e71F9611aca240E2FE660E4F4314ff',
		value: '0xde0b6b3a7640000', // in hex
		data: ''
	}

	var tx = new Tx(rawTx);
	tx.sign(privateKey);

	var serializedTx = tx.serialize();

	var tran = web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));

	tran.on('transactionHash', hash => {
		console.log('hash');
		console.log(hash);
	});
	
	tran.on('confirmation', (confirmationNumber, receipt) => {
		console.log('confirmation: ' + confirmationNumber);
	});

	tran.on('receipt', receipt => {
		console.log('reciept');
		console.log(receipt);
	});

	tran.on('error', console.error);

	ctx.body = { ethBalance };
});


module.exports = router;
