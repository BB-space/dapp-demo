var OddEven = artifacts.require('./OddEven.sol');

function stringToBytes32(str) {
	// cuts last 64 bits from hex if longer
	const hex = web3.toHex(str).substr(2);
	return '0x' + hex.substr(-64).padStart(64, '0');
}

const seedsToPush = ['a very', 'strong1', 'seeds'];

module.exports = async function(callback){
  const oddEven = await OddEven.deployed();
  const gameAddress = oddEven.address;
  console.log("gameAddress", gameAddress)
  const hash0 = await oddEven.encryptSeeds(stringToBytes32(seedsToPush[0]));
  const hash1 = await oddEven.encryptSeeds(stringToBytes32(seedsToPush[1]));
  const hash2 = await oddEven.encryptSeeds(stringToBytes32(seedsToPush[2]));
  hashes = [hash0,hash1,hash2];
  let prevLength = await oddEven.getHashListLength.call();
  console.log('hashes',hashes);
  console.log('prevLength', prevLength.toString());
  await oddEven.pushHashes(hashes);
  let afterLength = await oddEven.getHashListLength.call();
  console.log('afterLength', prevLength.toString());
}
