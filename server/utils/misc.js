const Web3 = require('web3');
const web3 = new Web3();


function generateRandomStr(strLen=10) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

	for (var i = 0; i < strLen; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

function keccak256(str) {
	return web3.utils.keccak256(str);
}


module.exports = {
	generateRandomStr,
	keccak256
};
