var OddEven = artifacts.require("./OddEven.sol");


contract('OddEven', function(accounts) {
	it("should assert true", function() {
		var oddEven;
		
		return OddEven
			.deployed()
			.then(instance => {
				console.log('OddEven Address:', instance.address);
				instance.getEther({value:web3.toWei(10, "ether")});
			});
	});
});
