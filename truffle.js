module.exports = {
	networks: {
		development: {
			host: "127.0.0.1",
			port: 7545,
			network_id: "5777"
		},
		rinkeby: {
			host: "localhost", // Connect to geth on the specified
			port: 8545,
			from: "0x0f8b9f87eb70fe45C460aA50eee4f21957cB4d57", // default address to use for any transaction Truffle makes during migrations
			network_id: 4,
			gas: 4612388 // Gas limit used for deploys
		}
	}
};
