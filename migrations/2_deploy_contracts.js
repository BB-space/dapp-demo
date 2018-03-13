const slot = artifacts.require("./slot.sol");


module.exports = function(deployer, network, accounts) {
	deployer.deploy(slot);
};
