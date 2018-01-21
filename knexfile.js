const path = require('path');

const BASE_PATH = path.join(__dirname, 'server', 'db');

module.exports = {
	development: {
		client: 'pg',
		connection: 'postgres://localhost:5432/gamble_dev',
		migrations: {
			directory: path.join(BASE_PATH, 'migrations')
		},
		seeds: {
			directory: path.join(BASE_PATH, 'seeds')
		}
	},
	/* test: {
	   client: 'pg',
	   connection: 'postgres://localhost:5432/koa_api_test',
	   migrations: {
	   directory: path.join(BASE_PATH, 'migrations')
	   },
	   seeds: {
	   directory: path.join(BASE_PATH, 'seeds')
	   }
	   },*/
};
