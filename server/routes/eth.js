const Router				= require('koa-router'),
	  Web3					= require('web3'),
	  makeSignedTransaction	= require('../utils/misc').makeSignedTransaction,
	  tokenABI				= require('../../build/contracts/Tulip.json').abi,
	  tokenSaleABI			= require('../../build/contracts/TokenSale.json').abi;


const router = new Router();
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const BASE_URL = '/api/eth';

const tokenAddress = '0x5cbd6de884c715f92356d82a0aba1b1aa693e77e';
const tokenSaleAddress = '0x1c41267dfc86ae1d195a2fc164e53c5c9193d34e';


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
