const knex = require('../connection');

function addUser(user, wallet) {
	return knex('users')
		.insert({
			username: user.username,
			password: user.password,
			wallet: wallet.address,
			private_key: wallet.privateKey
		})
		.returning('*');
}

function getWalletAddress(user) {
	return knex('users')
		.select('wallet')
		.where({ id: user.id });
}

function addWallet(username, account) {
	return knex('wallets')
		.insert({
			username,
			account: account.address,
			private_key: account.privateKey
		})
		.returning('*');
}


module.exports = {
	addUser
};
