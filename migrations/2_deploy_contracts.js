const OddEven = artifacts.require("./OddEven.sol");


module.exports = function(deployer, network, accounts) {
	deployer.deploy(OddEven, Tulip.address);
};
