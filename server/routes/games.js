const Router = require('koa-router');
const {
	generateRandomString,
	keccak256,
	reconstructResult,
	stringToBytes32
} = require('../utils/misc.js');

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
	.post(`${BASE_URL}`, ctx => {
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
		console.log('Result:', result);

		const playerWin = (betSide.toString() === result.toString());

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
			playerWin
		};

		games[gameId] = thisGame;
		gameId++;

		ctx.body = thisGame;
	});

module.exports = router;
