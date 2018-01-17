const Tulip = artifacts.require("./Tulip.sol");
// const Sha3Test = artifacts.require("./Sha3Test.sol");
// const OddEven = artifacts.require("./OddEven.sol");


module.exports = function(deployer, network, accounts) {
	deployer
		.deploy(Tulip);
};
