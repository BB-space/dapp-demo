import Router from 'koa-router';
import {
	generateRandomString,
	keccak256,
	reconstructResult,
	stringToBytes32,
	toWei
} from '../../common/utils';
import { makeSignedTransaction } from '../utils';
import { 
	tokenAddress,
	gameAddress 
} from '../../common/constants/contracts';


const tokenABI = require('../../../build/contracts/Tulip.json').abi;



const router = new Router();

const BASE_URL = '/api/games';

let decryptionMap = {};
let games = {};
let gameId = 0;



router
	.get(`${BASE_URL}/seedhash`, ctx => {
		const str = generateRandomString();
		const hashed = keccak256(stringToBytes32(str));

		decryptionMap[hashed] = str;

		ctx.body = { hashed_seed: hashed };
	})
	.post(`${BASE_URL}`, async ctx => {
		const user = ctx.state.user;
		const {
			wallet,
			private_key
		} = user;

		const {
			hashedServerSeed,
			clientSeed,
			clientSeedBytes32,
			betSide,
			betMoney
		} = ctx.request.body;

		const serverSeed = decryptionMap[hashedServerSeed];
		const serverSeedBytes32 = stringToBytes32(serverSeed);
		const result = reconstructResult(serverSeed, clientSeed);

		console.log('Server seed:', serverSeed);
		console.log('Server seed (in bytes):', serverSeedBytes32);
		console.log('Client seed (in bytes):', clientSeedBytes32);
		console.log('Result:', result);

		console.log('betmoney:', toWei(betMoney).toString());
		console.log('gameId:', gameId);

		const playerWin = (betSide.toString() === ((result[0] + result[1] + result[2]) % 2).toString());

		const tokenInstance = new web3.eth.Contract(tokenABI, tokenAddress);
		const txData = tokenInstance
			.methods
			.makeOneTimeGame(
				gameAddress,
				toWei(betMoney),
				gameId,
				hashedServerSeed,
				clientSeedBytes32,
				serverSeedBytes32,
				playerWin,
				web3.utils.asciiToHex(JSON.stringify({
					betSide
				}))
			)
			.encodeABI();

		const nonce = await web3.eth.getTransactionCount(wallet);

		const tran = makeSignedTransaction(
			wallet,
			private_key,
			tokenAddress,
			'0',
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

		const thisGame = {
			gameId,
			hashedServerSeed,
			clientSeed,
			clientSeedBytes32,
			serverSeed,
			serverSeedBytes32,
			result,
			betSide,
			betMoney,
			playerWin,
			tran
		};

		games[gameId] = thisGame;
		gameId++;

		ctx.body = thisGame;
	});

module.exports = router;
