const Tulip = artifacts.require("./Tulip.sol");
const TulipSale = artifacts.require("./TokenSale.sol");
const OddEven = artifacts.require("./OddEven.sol");


module.exports = function(deployer, network, accounts) {
	deployer
		.deploy(Tulip)
		.then(() => {
			console.log('token address', Tulip.address);
			deployer.deploy(OddEven, Tulip.address);
			deployer.deploy(TulipSale, Tulip.address, 1000, web3.eth.coinbase);
		});
};
