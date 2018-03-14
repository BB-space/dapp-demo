var Slot = artifacts.require('./slot.sol');

function stringToBytes32(str) {
	// cuts last 64 bits from hex if longer
	const hex = web3.fromAscii(str).substr(2);
	return '0x' + hex.substr(-64).padStart(64, '0');
}

const seedsToPush = ['a very', 'strong1', 'seeds'];

module.exports = async function(callback){
  const slot = await Slot.deployed();
  const gameAddress = slot.address;
  let hashLength = await slot.getHashListLength.call();
  for (i=0;i<hashLength;i++){
		hash = await slot.getHash.call(i);
		console.log("hash",hash);
	}
}
