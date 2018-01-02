var GustavoCoinCrowdsale = artifacts.require("./GustavoCoinCrowdsale.sol");

contract('GustavoCoinCrowdsale', function(accounts) {
  it("should assert true", function() {
    var crowdsale;
    var account = web3.eth.accounts[2];
    var accountTokenBalance;

    return GustavoCoinCrowdsale
            .deployed()
            .then(function(instance) {
              crowdsale = instance;
              return crowdsale.sendTransaction({ 
                from: account, 
                value: web3.toWei(5, "ether")
              });
            })
            .then(function(trx) {
              console.log(trx);
              return crowdsale.token();
            })
            .then(function(tokenInstance) {
              console.log(tokenInstance)
              // tokenInstance
              //   .balanceOf(account)
              //   .then(balance => { accountTokenBalance = balance.toString(10) });
            });
  });
});
