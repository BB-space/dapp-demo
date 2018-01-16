const TulipCrowdsale = artifacts.require("./TulipCrowdsale.sol")
const Sha3Test = artifacts.require("./Sha3Test.sol")
const OddEven = artifacts.require("./OddEven.sol")


module.exports = function(deployer, network, accounts) {
	const startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1;  // one second in the future
	const endTime = startTime + (86400 * 30);  // 30 days
	const rate = new web3.BigNumber('1000');
	const wallet = accounts[0];

	deployer
		.deploy(TulipCrowdsale, startTime, endTime, rate, wallet)
		.then(async () => {
			const tokenAddress = await TulipCrowdsale.at(TulipCrowdsale.address).token();
			console.log('token address', tokenAddress);
			await deployer.deploy(OddEven, tokenAddress);
			console.log('oddeven');
		});
};
