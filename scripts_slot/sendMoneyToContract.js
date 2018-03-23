var Slot = artifacts.require('./Slot.sol');

var ethAmount = 1000;
var accountIdx = 2;
module.exports = async function(callback){
  const slot = await Slot.deployed();
  const gameAddress = slot.address;
  console.log('value',web3.toWei(ethAmount,"ether"));
  const accounts = web3.eth.accounts;
  var send = await web3.eth.sendTransaction({
    from : accounts[0],
    to: gameAddress,
    value: web3.toWei(ethAmount, "ether")
  });
  gameContractBalance = await web3.eth.getBalance(gameAddress);
}
