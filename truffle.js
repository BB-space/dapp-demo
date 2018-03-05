const Web3 = require('web3');


module.exports = {
	networks: {
		development: {
			host: "127.0.0.1",
			port: 8545,
			network_id: "6000"
		},
		rinkeby: {
			/* provider: new Web3.providers.WebsocketProvider('ws://localhost:8545'),*/
			host: "localhost", // Connect to geth on the specified
			port: 8545,
			network_id: 4,
			from: "0x0f8b9f87eb70fe45C460aA50eee4f21957cB4d57"
		}
	}
};
