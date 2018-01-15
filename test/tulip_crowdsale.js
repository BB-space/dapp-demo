var TulipCrowdsale = artifacts.require("./TulipCrowdsale.sol");
var Tulip = artifacts.require("./Tulip.sol");


contract('TulipCrowdsale', function(accounts) {
	it("should assert true", function() {
		var crowdsale;
		var account = web3.eth.accounts[3];
		var accountTokenBalance;

		return TulipCrowdsale
            .deployed()
            .then(instance => {
				console.log('Crowdsale Address:', instance.address);
				crowdsale = instance;
				return crowdsale.sendTransaction({ 
					from: account, 
					value: web3.toWei(5, "ether")
				});
            })
            .then(trx => {
				console.log(`Ether sent from ${account} to contract issuer:`);
				console.log(trx);
				return crowdsale.token();
            })
            .then(function(tokenAddress) {
				tokenInstance = Tulip.at(tokenAddress);
				console.log('token Address:', tokenAddress);
				return tokenInstance
					.transfer
					.sendTransaction(web3.eth.accounts[0], web3.toWei(2000, "ether"), {from: account});
            })
            .then(trx => tokenInstance.balanceOf(web3.eth.accounts[0]))
            .then(balance => { 
				assert.equal(web3.fromWei(balance, "ether").toString(), 2000);
				console.log("0th account TLP :", web3.fromWei(balance, "ether").toString());
				return tokenInstance.balanceOf(account);
            })
            .then(balance => { 
				assert.equal(web3.fromWei(balance, "ether").toString(), 3000);
				console.log("3rd account TLP :", web3.fromWei(balance, "ether").toString());
            });
	});
});
