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
  let hashLength = await oddEven.getHashListLength.call();
  for (i=0;i<hashLength;i++){
		hash = await oddEven.getHash.call(i);
		console.log("hash",hash);
	}
}
