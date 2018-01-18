pragma solidity ^0.4.13;

import './token/MintableToken.sol';
import './math/SafeMath.sol';


contract TokenSale {
  using SafeMath for uint256;

  MintableToken public token;

  // address where funds are collected
  address public seller;

  // how many token units a buyer gets per wei
  uint256 public rate;

  // amount of raised money in wei
  uint256 public weiRaised;

  /**
   * event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param beneficiary who got the tokens
   * @param value weis paid for purchase
   * @param amount amount of tokens purchased
   */
  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);
  
  function TokenSale(address tokenAddress,
					 uint256 _rate,
					 address _wallet) {
	token = MintableToken(tokenAddress);
	seller = _wallet;
	rate = _rate;
  }

  // fallback function can be used to buy tokens
  function () external payable {
    buyTokens(msg.sender);
  }

  // low level token purchase function
  function buyTokens(address beneficiary) public payable {
    require(beneficiary != address(0));
    require(msg.value != 0);

    uint256 weiAmount = msg.value;

    // calculate token amount to be created
    uint256 token = weiAmount.mul(rate);

    // update state
    weiRaised = weiRaised.add(weiAmount);

    token.transferFrom(seller, beneficiary, token);
    TokenPurchase(msg.sender, beneficiary, weiAmount, token);

    forwardFunds();
  }

  function forwardFunds() internal {
    seller.transfer(msg.value);
  }
}
