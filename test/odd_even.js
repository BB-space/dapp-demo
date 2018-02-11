var OddEven = artifacts.require('./OddEven.sol');


function stringToBytes32(str) {
	// cuts last 64 bits from hex if longer
	const hex = web3.toHex(str).substr(2);
	return '0x' + hex.substr(-64).padStart(64, '0');
}


contract('OddEven', function(accounts) {
	it('should assert true', async function() {
		const oddEven = await OddEven.deployed();
		const gameAddress = oddEven.address;

		await web3.eth.sendTransaction({
			from: web3.eth.coinbase,
			to: gameAddress,
			value: web3.toWei(1, 'ether')
		});

		console.log('ether sent');

		let gameEthBalance = await web3.eth.getBalance(gameAddress);

		assert.equal(web3.fromWei(gameEthBalance, 'ether').toString(), '1');

		const testSeeds = ['a very', 'strong', 'seeds'];
		
		console.log('seeds:', testSeeds.map(stringToBytes32));

		await oddEven.pushHashes(testSeeds.map(
			e => web3.sha3(stringToBytes32(e))
		));

		const firstHash = await oddEven.getHashArray.call();
		console.log(firstHash);
	});
});
