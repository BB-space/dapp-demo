const slot = artifacts.require("./slot.sol");
const quickSort = artifacts.require('./quickSort.sol');
const grc = artifacts.require('./grc.sol');

module.exports = function(deployer, network, accounts) {
	deployer.deploy(slot);
	deployer.deploy(quickSort);
	deployer.deploy(grc);
};
