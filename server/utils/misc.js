const Web3 = require('web3');
const web3 = new Web3();


function generateRandomHex(length=16) {
	var hex = '';
	var possible = '0123456789abcdef';

	for (var i = 0; i < length; i++) {
		hex += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return hex;
}

function keccak256(str) {
	return web3.utils.keccak256(str);
}


module.exports = {
	generateRandomHex,
	keccak256
};
