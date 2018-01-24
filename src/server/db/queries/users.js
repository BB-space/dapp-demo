const knex = require('../connection');

function addUser(user, wallet) {
	return knex('users')
		.insert({
			email: user.email,
			password: user.password,
			wallet: wallet.address,
			private_key: wallet.privateKey
		})
		.returning('*');
}


module.exports = {
	addUser
};
