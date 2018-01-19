const Tulip = artifacts.require("./Tulip.sol");
const TokenSale = artifacts.require("./TokenSale.sol");
const OddEven = artifacts.require("./OddEven.sol");
const Sha3Test = artifacts.require("./Sha3Test.sol");


module.exports = function(deployer, network, accounts) {
	deployer.deploy(Sha3Test);
	deployer
		.deploy(Tulip)
		.then(() => {
			console.log('token address', Tulip.address);
			deployer.deploy(OddEven, Tulip.address);
			deployer.deploy(TokenSale, Tulip.address, 1000, web3.eth.coinbase);
		});
};
