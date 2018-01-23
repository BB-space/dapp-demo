const Router				= require('koa-router'),
	  Web3					= require('web3'),
	  makeSignedTransaction	= require('../utils/misc').makeSignedTransaction,
	  tokenABI				= require('../../build/contracts/Tulip.json').abi,
	  tokenSaleABI			= require('../../build/contracts/TokenSale.json').abi;



const router = new Router();
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const BASE_URL = '/api/eth';

const tokenAddress = '0x5072d9c700d8867093301211764b9ff082167248';
const tokenSaleAddress = '0xbba9a6f9356520d6ac6892ffcaeb4e37c8560c45';


router.get(`${BASE_URL}/balance`, async (ctx) => {
	const user = ctx.state.user;
	const {
		wallet,
		private_key
	} = user;

	if (!ctx.isAuthenticated()) {
		ctx.body = { status: 'not logged in' }
		return false;
	}

	const ethBalance = await web3.eth.getBalance(wallet);
	
	const tokenInstance = new web3.eth.Contract(tokenABI, tokenAddress);
	const tokenBalance = await tokenInstance
		.methods
		.balanceOf(wallet)
		.call();

	ctx.body = {
		ethBalance,
		tokenBalance
	};
});

router.post(`${BASE_URL}/tokenpurchase`, async (ctx) => {
	const user = ctx.state.user;
	const { amtWei } = ctx.request.body;
	const {
		wallet,
		private_key
	} = user;

	if (!ctx.isAuthenticated()) {
		ctx.body = { status: 'not logged in' }
		return false;
	}
	
	const tokenSaleInstance = new web3.eth.Contract(tokenSaleABI, tokenSaleAddress);
	
	const txData = tokenSaleInstance
		.methods
		.buyTokens(wallet)
		.encodeABI();

	const nonce = await web3.eth.getTransactionCount(wallet);

	console.log('wallet', wallet);
	console.log('private_key', private_key);
	console.log('tokenSaleAddress', tokenSaleAddress);
	console.log('amtWei', amtWei);

	const tran = makeSignedTransaction(
		wallet,
		private_key,
		tokenSaleAddress,
		amtWei,
		nonce,
		txData
	);

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

	ctx.body = { success: true, transaction: tran };

});


module.exports = router;
