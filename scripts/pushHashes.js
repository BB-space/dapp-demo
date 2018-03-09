var OddEven = artifacts.require('./OddEven.sol');

function stringToBytes32(str) {
	// cuts last 64 bits from hex if longer
	const hex = web3.fromAscii(str).substr(2);
	return '0x' + hex.substr(-64).padStart(64, '0');
}

const seedsToPush = '11,22,33,44,55,66,77,88,99,100,111,222,333,444,555,666,777,888,999,1111,2222,3333,4444,5555,6666,7777,8888,9999'.split(',');

module.exports = async function(callback){
	const oddEven = await OddEven.deployed();
	const gameAddress = oddEven.address;

	console.log('gameAddress', gameAddress);

	let hashes = [];

	// by KTH
	// Array.forEach 와 같은 higher-order function들은 async/await 을 제대로 지원하지 못한다.
	// 아래 링크의 코드를 보면 callback 에 대한 await 이 없기에...
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Polyfill
	// await 을 추가한 별도의 함수(forEachAsync)를 만들거나 그냥 for 루프를 써야 한다.
	
	await seedsToPush.forEach(async e => {
		let x = await oddEven.encryptSeeds(stringToBytes32(e));
		hashes.push(x);
	}

	let prevLength = await oddEven.getHashListLength.call();
	
	console.log("-------------------------------");
	console.log('hashes', hashes);
	console.log('prevLength', prevLength.toString());
	
	await oddEven.pushHashes(hashes);
	
	let afterLength = await oddEven.getHashListLength.call();
	console.log("-------------------------------");
	console.log('afterLength', afterLength.toString());
	console.log("-------------------------------");
};
