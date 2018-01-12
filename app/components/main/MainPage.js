import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { getAccountStatus } from '../../actions/ethStateActions';
import { fromWei, toWei } from '../../utils/misc';
import GamePage from '../game/GamePage';
import ValidationSection from '../game/ValidationSection';


import {abi as tulipSaleABI} from '../../../build/contracts/TulipCrowdsale.json';
import {abi as tulipABI} from '../../../build/contracts/Tulip.json';


const issuerAddress = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';


@connect(
	(state, ownProps) => ({
		currentAccount: state.ethState.currentAccount,
		ethBalance: state.ethState.ethBalance,
		tokenBalance: state.ethState.tokenBalance
	}),	{
		getAccountStatus
	}
)
export default class MainPage extends Component {
	constructor(props) {
		super(props);

		this.refreshStatus = this.refreshStatus.bind(this);
		this.handleSaleAddressChange = this.handleInputChange.bind(this, 'crowdsaleAddress');
		this.handleTokenAddressChange = this.handleInputChange.bind(this, 'tokenAddress');
		this.handleEthForTokenChange = this.handleInputChange.bind(this, 'ethForTokenPurchase');
		this.handleTlpForTransferChange = this.handleInputChange.bind(this, 'tlpForTransfer');
		this.handleTlpRecipientChange = this.handleInputChange.bind(this, 'tlpRecipient');

		this.state = {
			crowdsaleAddress: '0xfb88de099e13c3ed21f80a7a1e49f8caecf10df6',
			tokenAddress: '0x440b7f9b667420af04e88d4da0b9122e05cca5a0',
			ethForTokenPurchase: 0,
			tlpForTransfer: 0,
			tlpRecipient: '',
			issuerBalance: 0
		};

		this.refreshStatus();
    }

	refreshStatus = async () => {
		const issuerBalance = await web3.eth.getBalance(issuerAddress);
		
		this.props.getAccountStatus(this.state.tokenAddress);
		this.setState({
			issuerBalance
		});
	}

	purchaseToken = () => {
		const {
			currentAccount
		} = this.props;
		
		const {
			ethForTokenPurchase,
			crowdsaleAddress,
			tulipSaleContract
		} = this.state;

		const crowdsaleInstance = new web3.eth.Contract(tulipSaleABI, crowdsaleAddress);

		debugger;
		
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
		} = this.props;
		
		const {
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
			tokenBalance
		} = this.props;
		
		const {
			crowdsaleAddress,
			tokenAddress,
			ethForTokenPurchase,
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
							<button onClick={this.refreshStatus}>Refresh</button>
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
							<button onClick={this.refreshStatus}>Refresh</button>
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



				<GamePage />
				<ValidationSection />
				
			</main>
		);
    }
}
