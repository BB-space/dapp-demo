import React, { Component } from 'react';
import classNames from 'classnames';
import { fromWei, toWei } from '../../utils/misc';

import {abi as tulipABI} from '../../../build/contracts/Tulip.json';
import {abi as tulipSaleABI} from '../../../build/contracts/TulipCrowdsale.json';



export default class MainPage extends Component {
	constructor(props) {
		super(props);

		this.handleSaleAddressChange = this.handleInputChange.bind(this, 'crowdsaleAddress');
		this.handleTokenAddressChange = this.handleInputChange.bind(this, 'tokenAddress');
		this.handleEthForTokenChange = this.handleInputChange.bind(this, 'ethForTokenPurchase');
		this.handleTlpForTransferChange = this.handleInputChange.bind(this, 'tlpForTransfer');
		this.handleTlpRecipientChange = this.handleInputChange.bind(this, 'tlpRecipient');

		this.state = {
			currentAccount: null,
			ethBalance: 0,
			crowdsaleAddress: '0x345ca3e014aaf5dca488057592ee47305d9b3e10',
			tokenAddress: '0xf2beae25b23f0ccdd234410354cb42d08ed54981',
			ethForTokenPurchase: 0,
			tokenBalance: 0,
			tlpForTransfer: 0,
			tlpRecipient: ''
		};

		this.getAccountStatus();
		this.getTokenBalance();
    }

	getAccountStatus = () => {
		web3.eth.getCoinbase()
			.then(account => {
				
				this.setState({
					currentAccount: account
				});
				return web3.eth.getBalance(account);
			})
			.then(balance => {
				this.setState({
					ethBalance: balance
				});
			});
	}

	getTokenBalance = () => {
		const {
			currentAccount,
			tokenAddress
		} = this.state;

		const tokenInstance = new web3.eth.Contract(tulipABI, tokenAddress);

		tokenInstance
			.methods
			.balanceOf(currentAccount).call()
			.then(balance => {
				this.setState({ tokenBalance: balance });
			});
	}

	purchaseToken = () => {
		const {
			currentAccount,
			ethForTokenPurchase,
			crowdsaleAddress,
			tulipSaleContract
		} = this.state;

		const crowdsaleInstance = new web3.eth.Contract(tulipSaleABI, crowdsaleAddress);

		crowdsaleInstance
			.methods
			.buyTokens(currentAccount)
			.send({ 
				from: currentAccount, 
				value: toWei(ethForTokenPurchase)
			});
	}

	sendTLP = () => {
		const {
			currentAccount,
			tokenAddress,
			tlpForTransfer,
			tlpRecipient
		} = this.state;

		const tokenInstance = new web3.eth.Contract(tulipABI, tokenAddress);

		tokenInstance
			.methods
			.transfer(tlpRecipient, toWei(tlpForTransfer))
			.send({ 
				from: currentAccount
			});
	}

	handleInputChange(whichState, evt) {
		const newVal = evt.target.value;

		this.setState({ [whichState]: newVal });
	}
	

    render() {
		const {
			currentAccount,
			ethBalance,
			crowdsaleAddress,
			tokenAddress,
			ethForTokenPurchase,
			tokenBalance,
			tlpForTransfer,
			tlpRecipient
		} = this.state;
		
		return (
			<main>
				<h1>Sample Dapp</h1>

				<div className="panel">
					<ul>
						<li>Account: {currentAccount || 'Not Connected'}</li>
						<li>ETH Balance: {fromWei(ethBalance).toString() || '0.0'}</li>
						<button onClick={this.getAccountStatus}>Refresh</button>
					</ul>
				</div>
				
				<div className="panel">
					<ul>
						<li>Crowdsale Address:
							<input value={crowdsaleAddress}
								   onChange={this.handleSaleAddressChange} />
						</li>
						<li>
							Buy Tokens for <br/>
							<input value={ethForTokenPurchase}
								   onChange={this.handleEthForTokenChange} /> ETH
							( = {ethForTokenPurchase * 1000} TLP)
						</li>
						<button onClick={this.purchaseToken}>Purchase</button>
					</ul>
				</div>

				<div className="panel">
					<ul>
						<li>Token Address:
							<input value={tokenAddress}
								   onChange={this.handleTokenAddressChange} />
						</li>
						<li>Token Balance: {fromWei(tokenBalance).toString() || '0.0'}</li>
						<button onClick={this.getTokenBalance}>Refresh</button>
						<li>Send {' '}
							<input value={tlpForTransfer}
								   onChange={this.handleTlpForTransferChange} />
							TLP {' '}
							to {' '}
							<input value={tlpRecipient}
								   onChange={this.handleTlpRecipientChange} />
							{' '} <button onClick={this.sendTLP}>Send</button>
						</li>
					</ul>
				</div>
				
			</main>
		);
    }
}
