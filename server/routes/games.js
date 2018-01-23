const Router = require('koa-router');
const Web3 = require('web3');
const {
	generateRandomString,
	keccak256,
	reconstructResult,
	stringToBytes32,
	makeSignedTransaction,
	toWei
} = require('../utils/misc.js');

const tokenABI = require('../../build/contracts/Tulip.json').abi;



const router = new Router();

const BASE_URL = '/api/games';

let decryptionMap = {};
let games = {};
let gameId = 0;

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// const gameAddress = '0x2a8ed75eda665181910976aa105b2356b49de8c6';
// const tokenAddress = '';

const gameAddress = require('../../build/contracts/OddEven.json')['networks']['1516714730290']['address'];
const tokenAddress = require('../../build/contracts/Tulip.json')['networks']['1516714730290']['address'];



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

		const playerWin = (betSide.toString() === result.toString());

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
