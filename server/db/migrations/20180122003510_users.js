exports.up = (knex, Promise) => {
	return knex.schema.createTable('users', (table) => {
		table.increments();
		table.string('username').unique().notNullable();
		table.string('password').notNullable();
		table.string('wallet').notNullable();
		table.string('private_key').notNullable();
	});
};

exports.down = (knex, Promise) => {
	return knex.schema.dropTable('users');
};
