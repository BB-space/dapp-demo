import Router from 'koa-router';
import {abi as tokenABI} from '../../../build/contracts/Tulip.json';
import {abi as tokenSaleABI} from '../../../build/contracts/TokenSale.json';

import { makeSignedTransaction } from '../utils';
import { nodeLocation } from '../../common/constants/config';


const router = new Router();


const BASE_URL = '/api/eth';


router.get(`${BASE_URL}/balance`, async (ctx) => {
	if (!ctx.isAuthenticated()) {
		ctx.body = {
			success: false,
			status: 'not logged in'
		}
		return false;
	}
	
	const user = ctx.state.user;
	const {
		wallet,
		private_key
	} = user;

	const ethBalance = await web3.eth.getBalance(wallet);

	ctx.body = {
		success: true,
		ethBalance
	};
});


router.get(`${BASE_URL}/test`, async (ctx) => {
	const ethBalance = await web3.eth.getBalance('0xc31Eb6E317054A79bb5E442D686CB9b225670c1D');

	ctx.body = {
		success: true,
		ethBalance
	};
});

/* router.post(`${BASE_URL}/tokenpurchase`, async (ctx) => {
 * 	const user = ctx.state.user;
 * 	const { amtWei } = ctx.request.body;
 * 	const {
 * 		wallet,
 * 		private_key
 * 	} = user;
 * 
 * 	if (!ctx.isAuthenticated()) {
 * 		ctx.body = { status: 'not logged in' }
 * 		return false;
 * 	}
 * 
 * 	const tokenSaleInstance = new web3.eth.Contract(tokenSaleABI, tokenSaleAddress);
 * 
 * 	const txData = tokenSaleInstance
 * 		.methods
 * 		.buyTokens(wallet)
 * 		.encodeABI();
 * 
 * 	const nonce = await web3.eth.getTransactionCount(wallet);
 * 
 * 	console.log('wallet', wallet);
 * 	console.log('private_key', private_key);
 * 	console.log('tokenSaleAddress', tokenSaleAddress);
 * 	console.log('amtWei', amtWei);
 * 
 * 	const tran = makeSignedTransaction(
 * 		wallet,
 * 		private_key,
 * 		tokenSaleAddress,
 * 		amtWei,
 * 		nonce,
 * 		txData
 * 	);
 * 
 * 	tran.on('transactionHash', hash => {
 * 		console.log('hash');
 * 		console.log(hash);
 * 	});
 * 
 * 	tran.on('confirmation', (confirmationNumber, receipt) => {
 * 		console.log('confirmation: ' + confirmationNumber);
 * 	});
 * 
 * 	tran.on('receipt', receipt => {
 * 		console.log('reciept');
 * 		console.log(receipt);
 * 	});
 * 
 * 	tran.on('error', console.error);
 * 
 * 	ctx.body = { success: true, transaction: tran };
 * 
 * });*/


module.exports = router;
