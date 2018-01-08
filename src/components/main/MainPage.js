import React, { Component } from 'react';
import classNames from 'classnames';
import { fromWei, toWei } from '../../utils/misc';

import {abi as tulipABI} from '../../../build/contracts/Tulip.json';
import {abi as tulipSaleABI} from '../../../build/contracts/TulipCrowdsale.json';


const issuerAddress = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';

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
			crowdsaleAddress: '0xf204a4ef082f5c04bb89f7d5e6568b796096735a',
			tokenAddress: '0x633baefc98220497eb7ee323480c87ce51a44955',
			ethForTokenPurchase: 0,
			tokenBalance: 0,
			tlpForTransfer: 0,
			tlpRecipient: '',
			issuerBalance: 0
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

		web3.eth.getBalance(issuerAddress)
			.then(balance => {
				this.setState({
					issuerBalance: balance
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
			tlpRecipient,
			issuerBalance
		} = this.state;
		
		return (
			<main>
				<h1>Sample Dapp</h1>

				<div className="panel panel-default">
					<div className="panel-body">
						<ul>
							<li>Account: {currentAccount || 'Not Connected'}</li>
							<li>ETH Balance: {fromWei(ethBalance).toString() || '0.0'}</li>
							<li>Token Issuer ETH Balance: {fromWei(issuerBalance).toString() || '0.0'}</li>
							<button onClick={this.getAccountStatus}>Refresh</button>
						</ul>
					</div>
				</div>
				
				<div className="panel panel-default">
					<div className="panel-body">
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
				</div>

				<div className="panel panel-default">
					<div className="panel-body">
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
				</div>
					
			</main>
		);
    }
}
