const express = require('express');
const { generateRandomString, keccak256, reconstructResult } = require('./utils/misc.js');


const router = express.Router();


let decryptionMap = {};
let games = {};
let gameId = 0;

router
	.get('/seedhash', function(req, res) {
		const str = generateRandomString();
		const hashed = keccak256(str);

		decryptionMap[hashed] = str;
		
		res.json({ hashed_seed: hashed });
	})
	.post('/game', function(req, res) {
		console.log('req data:', req.body);
		console.log(decryptionMap);

		const {
			hashedServerSeed,
			clientSeed,
			betSide,
			betMoney
		} = req.body;
		const serverSeed = decryptionMap[hashedServerSeed];

		// code
		const result = reconstructResult(serverSeed, clientSeed);
		console.log('Server seed:', serverSeed);
		console.log(result);

		const playerWin = (betSide.toString() === result.toString());

		const thisGame = {
			gameId,
			hashedServerSeed,
			clientSeed,
			serverSeed,
			result,
			betMoney,
			betSide,
			playerWin
		};

		games[gameId] = thisGame;
		gameId++;
 
		res.json(thisGame);
	})



module.exports = router;
