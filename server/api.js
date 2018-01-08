const express = require('express');
const { generateRandomStr, keccak256 } = require('./utils/misc.js');


const router = express.Router();

router.get('/seed/', function(req, res) {
	let str = generateRandomStr();
	res.json({ hashed_seed: keccak256(str) });
});


module.exports = router;
