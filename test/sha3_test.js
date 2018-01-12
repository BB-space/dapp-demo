var Sha3Test = artifacts.require("./Sha3Test.sol");


contract('Sha3Test', function(accounts) {
	it("should assert true", function() {
		return Sha3Test
            .deployed()
			.then(instance => {
				console.log('Sha3Test Address:', instance.address);

				return instance.bytesTest.call('{a: 1}');
            })
			.then(console.log);
	});
});
