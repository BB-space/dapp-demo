var TulipCrowdsale = artifacts.require("./TulipCrowdsale.sol");
var Tulip = artifacts.require("./Tulip.sol");
var OddEven = artifacts.require("./OddEven.sol");



contract('OddEven', function(accounts) {
	it("should assert true", async function() {
		let account = web3.eth.accounts[3];

		let crowdsale = await TulipCrowdsale.deployed();
		console.log('Crowdsale Address:', crowdsale.address);
		
		let trx = await crowdsale.sendTransaction({ 
			from: account, 
			value: web3.toWei(5, "ether")
		});
		console.log(`Ether sent from ${account} to contract issuer:`);
		console.log(trx);

		let tokenAddress = await crowdsale.token();
		let tokenInstance = Tulip.at(tokenAddress);
		console.log('token Address:', tokenAddress);
		
		trx = await tokenInstance
			.transfer
			.sendTransaction(
				web3.eth.accounts[0],
				web3.toWei(2000, "ether"),
				{from: account}
			);

		let account0tlpBalance = await tokenInstance.balanceOf(
			web3.eth.accounts[0]
		);

		assert.equal(
			web3.fromWei(account0tlpBalance, "ether").toString(),
			2000
		);

		console.log("0th account TLP balance:", web3.fromWei(account0tlpBalance, "ether").toString());

		let account3tlpBalance = await tokenInstance.balanceOf(
			account
		);

		assert.equal(web3.fromWei(account3tlpBalance, "ether").toString(), 3000);
		console.log("3rd account TLP balance:", web3.fromWei(account3tlpBalance, "ether").toString());

		let oddEven = await OddEven.deployed();
		let gameAddress = oddEven.address;

		await tokenInstance.makeGame(
			gameAddress,
			web3.toWei(100, "ether"),
			333,
			'0x0000000000000000000000000000000000000000000000000000000000000000',
			'0x0000000000000000000000000000000000000000000000000000000000000000',
			'0x0000'
		);

		let contractTlpBalance = await tokenInstance.balanceOf(
			gameAddress
		);
		console.log("Game contract TLP balance:", web3.fromWei(contractTlpBalance, "ether").toString());

		
	});
});
