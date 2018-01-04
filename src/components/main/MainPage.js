import React, { Component } from 'react';
import classNames from 'classnames';
import BigNumber from 'bignumber.js';

import {abi as tulipSaleABI} from '../../../build/contracts/TulipCrowdsale.json';



export default class MainPage extends Component {
	constructor(props) {
		super(props);

		const tulipSaleInstance = new web3.eth.Contract(tulipSaleABI);

		this.handleSaleAddressChange = this.handleInputChange.bind(this, 'crowdsaleAddress');
		this.handleTokenAddressChange = this.handleInputChange.bind(this, 'tokenAddress');

		this.state = {
			currentAccount: null,
			ethBalance: null,
			tulipSaleInstance,
			crowdsaleAddress: '',
			tokenAddress: ''
		};

		this.getAccountStatus();
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

	handleInputChange(whichState, evt) {
		const newVal = evt.target.value;

		this.setState({ whichState: newVal });
	}
	

    render() {
		const {
			currentAccount,
			ethBalance,
			crowdsaleAddress
		} = this.state;
		
		return (
			<main>
				<h1>Demo Dapp</h1>

				<div className="panel">
					<ul>
						<li>Account: {currentAccount || 'Not Connected'}</li>
						<li>ETH Balance: {ethBalance || '0.0'}</li>
						<button onClick={this.getAccountStatus}>Refresh</button>
					</ul>
				</div>
				
				<div className="panel">
					<ul>
						<li>Crowdsale Address:
							<input value={crowdsaleAddress}
								   onChange={this.handleSaleAddressChange} />
						</li>
						<li>Token Address:
							<input value={tokenAddress}
								   onChange={this.handleTokenAddressChange} />
						</li>
					</ul>
				</div>
				
			</main>
		);
    }
}
