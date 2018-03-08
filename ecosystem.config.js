module.exports = {
    apps: [
		{
			name      : "diceroll",
			script    : "src/server/index.js",
			env : {
				NODE_ENV: "build",
				ETH_ENV: "npseth"
			},
			interpreter: "./node_modules/babel-cli/bin/babel-node.js"
		}
    ]
};
