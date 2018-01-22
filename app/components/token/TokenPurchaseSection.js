import React, { Component } from 'react';
import { connect } from 'react-redux';
import { crowdsaleAddress } from '../../constants/addresses';
import { toWei } from '../../utils/misc';

import {abi as tulipSaleABI} from '../../../build/contracts/TokenSale.json';


@connect(
	(state, ownProps) => ({
		currentAccount: state.ethState.currentAccount,
		tokenBalance: state.ethState.tokenBalance
	}),	{

	}
)
export default class TokenPurchaseSection extends Component {
	constructor(props) {
		super(props);

		this.handleSaleAddressChange = this.handleInputChange.bind(this, 'crowdsaleAddress');
		this.handleEthForTokenChange = this.handleInputChange.bind(this, 'ethForTokenPurchase');
		

		this.state = {
			ethForTokenPurchase: 0,
			crowdsaleAddress
		};
	}

	handleInputChange(whichState, evt) {
		const newVal = evt.target.value;

		this.setState({ [whichState]: newVal });
	}

	purchaseToken = () => {
		const {
			currentAccount
		} = this.props;

		const {
			ethForTokenPurchase,
			crowdsaleAddress
		} = this.state;

		const crowdsaleInstance = new web3.eth.Contract(tulipSaleABI, crowdsaleAddress);

		return crowdsaleInstance
			.methods
			.buyTokens(currentAccount)
			.send({
				from: currentAccount,
				value: toWei(ethForTokenPurchase)
			})
			.on('confirmation', (confNum, receipt) => {
				console.log(confNum, receipt);
			})
			.then(() => {
				this.setState({
					tlpForTransfer: 0
				});
				this.refreshStatus();
			});
	}

	
	render() {
		const {
			ethForTokenPurchase,
			crowdsaleAddress
		} = this.state;

		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					토큰 구매
				</div>
				<div className="panel-body">
					<ul>
						<li>1 ETH {'<=>'} 1,000 TLP</li>
						<li>판매 Contract 주소:
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
		);
	}
}
