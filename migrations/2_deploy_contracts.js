const Slot = artifacts.require("./Slot.sol");
const OddEven = artifacts.require("./OddEven.sol");

module.exports = function(deployer, network, accounts) {
	deployer.deploy(Slot);
	deployer.deploy(OddEven);
};
