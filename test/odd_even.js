var OddEven = artifacts.require('./OddEven.sol');


function stringToBytes32(str) {
	// cuts last 64 bits from hex if longer
	const hex = web3.toHex(str).substr(2);
	return '0x' + hex.substr(-64).padStart(64, '0');
}

const testSeeds = ['a very', 'strong', 'seeds'];
let hashes = [];
contract('OddEven', function(accounts) {
	it('send ether', async function(){
		await web3.eth.sendTransaction({
			from : accounts[1],
			to : accounts[0],
			value: web3.toWei(1,"ether")
		})
	});
	it('check get Ether', async function(){
		const oddEven = await OddEven.deployed();
		const gameAddress = oddEven.address;
		console.log('value',web3.toWei(1,"ether"));
		var send = await web3.eth.sendTransaction({
			from : accounts[0],
			to: gameAddress,
			value: web3.toWei(1, "ether")
		});
		gameContractBalance = await web3.eth.getBalance(gameAddress);
		assert.equal(
			web3.fromWei(gameContractBalance, 'ether').toString(),
			'1'
		)
	});
	it('push hashes', async function(){
		const oddEven = await OddEven.deployed();
		const gameAddress = oddEven.address;
		const hash0 = await oddEven.encryptSeeds(stringToBytes32(testSeeds[0]));
		const hash1 = await oddEven.encryptSeeds(stringToBytes32(testSeeds[1]));
		const hash2 = await oddEven.encryptSeeds(stringToBytes32(testSeeds[2]));
		hashes = [hash0,hash1,hash2];
		let prevLength = await oddEven.getHashListLength.call();
		console.log('hashes',hashes);
		console.log('prevLength', prevLength.toString());
		await oddEven.pushHashes(hashes);
		let afterLength = await oddEven.getHashListLength.call();
		console.log('afterLength', prevLength.toString());
	});
	it('init with second hash', async function(){
		const oddEven = await OddEven.deployed();
		const gameAddress = oddEven.address;
		const prevPlayerBalance = await web3.eth.getBalance(accounts[0]);
		const prevGameBalance = await web3.eth.getBalance(gameAddress);
		let _hash1 = await oddEven.getHash.call(1);
		console.log('prevPlayerBalance', prevPlayerBalance);
		console.log('prevGameBalance', prevGameBalance);
		await oddEven.initGame(
			hashes[1],
			stringToBytes32('myseed'),
			[1,2],
			{ value: web3.toWei(1) }
		);
		console.log(
			'after init:',
			'data',
			await oddEven.getGame(_hash1),
			'betData',
			await oddEven.getBetData(_hash1),
			'gameResult',
			await oddEven.getGameResult(_hash1),
			'playingGames',
			await oddEven.getPlayingGames(accounts[0])
		);
	});
	it('check after init', async function(){
		const oddEven = await OddEven.deployed();
		const gameAddress = oddEven.address;
		const afterLength = await oddEven.getHashListLength.call();
		const afterPlayerBalance = await web3.eth.getBalance(accounts[0]);
		const afterGameBalance = await web3.eth.getBalance(gameAddress);
		console.log('afterLength', afterLength.toString());
		console.log('nextPlayerBalance', afterPlayerBalance);
		console.log('nextGameBalance', afterGameBalance);
	});
	it('finalizes', async function(){
		const oddEven = await OddEven.deployed();
		const gameAddress = oddEven.address;
		const hashes = await oddEven.getPlayingGames(accounts[0])
		const _hash1 = hashes[0];
		console.log(_hash1, stringToBytes32(testSeeds[1]));
		await oddEven.finalize(_hash1, stringToBytes32(testSeeds[1]));
		console.log(
			'after finalize:',
			'data',
			await oddEven.getGame(_hash1),
			'betData',
			await oddEven.getBetData(_hash1),
			'gameResult',
			await oddEven.getGameResult(_hash1),
			'playingGames',
			await oddEven.getPlayingGames(accounts[0])
		);
		const afterPlayerBalance = await web3.eth.getBalance(accounts[0]);
		const afterGameBalance = await web3.eth.getBalance(gameAddress);
		console.log('nextPlayerBalance', afterPlayerBalance);
		console.log('nextGameBalance', afterGameBalance);
	})
	it('changeCoo', async function(){
		const oddEven = await OddEven.deployed();
		const gameAddress = oddEven.address;
		await oddEven.changeCoo(accounts[1]);
	});
	it('check get Ether', async function(){
		const oddEven = await OddEven.deployed();
		const gameAddress = oddEven.address;
		console.log('value',web3.toWei(1,"ether"));
		var send = await web3.eth.sendTransaction({
			from : accounts[0],
			to: gameAddress,
			value: web3.toWei(1, "ether")
		});
		gameContractBalance = await web3.eth.getBalance(gameAddress);
		assert.equal(
			web3.fromWei(gameContractBalance, 'ether').toString(),
			'1.02'
		)
	});
	it('init with first hash', async function(){
		const oddEven = await OddEven.deployed();
		const gameAddress = oddEven.address;
		const prevPlayerBalance = await web3.eth.getBalance(accounts[0]);
		const prevGameBalance = await web3.eth.getBalance(gameAddress);
		let _hash1 = await oddEven.getHash.call(0);
		console.log('prevPlayerBalance', prevPlayerBalance);
		console.log('prevGameBalance', prevGameBalance);
		await oddEven.initGame(
			hashes[0],
			stringToBytes32('myseed'),
			[0,2],
			{ value: web3.toWei(1) }
		);
		console.log(
			'after init:',
			'data',
			await oddEven.getGame(_hash1),
			'betData',
			await oddEven.getBetData(_hash1),
			'gameResult',
			await oddEven.getGameResult(_hash1),
			'playingGames',
			await oddEven.getPlayingGames(accounts[0])
		);
	});
	it('should be reverted', async function(){
		const oddEven = await OddEven.deployed();
		const gameAddress = oddEven.address;
		const hashes = await oddEven.getPlayingGames(accounts[0])
		const _hash1 = hashes[0];
		console.log(_hash1, stringToBytes32(testSeeds[1]));
		await oddEven.finalize(_hash1, stringToBytes32(testSeeds[1]));
		console.log(
			'after finalize:',
			'data',
			await oddEven.getGame(_hash1),
			'betData',
			await oddEven.getBetData(_hash1),
			'gameResult',
			await oddEven.getGameResult(_hash1),
			'playingGames',
			await oddEven.getPlayingGames(accounts[0])
		);
		const afterPlayerBalance = await web3.eth.getBalance(accounts[0]);
		const afterGameBalance = await web3.eth.getBalance(gameAddress);
		console.log('nextPlayerBalance', afterPlayerBalance);
		console.log('nextGameBalance', afterGameBalance);
	})
});
