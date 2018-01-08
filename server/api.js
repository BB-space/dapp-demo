const express = require('express');
const { generateRandomStr, keccak256 } = require('./utils/misc.js');


const router = express.Router();


let decryptionMap = {};

router
	.get('/seedhash', function(req, res) {
		const str = generateRandomStr();
		const hashed = keccak256(str);

		decryptionMap[hashed] = str;
		
		res.json({ hashed_seed: hashed });
	})
	.post('/game', function(req, res) {
		console.log('req data:', req.body);
		console.log(decryptionMap);

		const { hashedServerSeed, clientSeed } = req.body;
		const serverSeed = decryptionMap[hashedServerSeed];

		res.json({ serverSeed });
	})






module.exports = router;
