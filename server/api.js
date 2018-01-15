const express = require('express');
const {
	generateRandomString,
	keccak256,
	reconstructResult,
	stringToBytes32
} = require('./utils/misc.js');


const router = express.Router();


let decryptionMap = {};
let games = {};
let gameId = 0;

router
	.get('/seedhash', function(req, res) {
		const str = generateRandomString();
		const hashed = keccak256(stringToBytes32(str));

		decryptionMap[hashed] = str;
		
		res.json({ hashed_seed: hashed });
	})
	.post('/game', function(req, res) {
		const {
			hashedServerSeed,
			clientSeed,
			clientSeedBytes32,
			betSide,
			betMoney
		} = req.body;
		
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
 
		res.json(thisGame);
	})



module.exports = router;
