const slot = artifacts.require("./Slot.sol");

module.exports = function(deployer, network, accounts) {
	deployer.deploy(Slot);
};
