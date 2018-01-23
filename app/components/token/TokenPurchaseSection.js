import React, { Component } from 'react';
import { connect } from 'react-redux';
import { buyTokens } from '../../actions/ethStateActions';
import { crowdsaleAddress } from '../../constants/addresses';
import { toWei } from '../../utils/misc';

import {abi as tokenSaleABI} from '../../../build/contracts/TokenSale.json';


@connect(
	(state, ownProps) => ({
		tokenBalance: state.auth.tokenBalance
	}),	{
		buyTokens
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
			buyTokens
		} = this.props;

		const {
			ethForTokenPurchase,
		} = this.state;
		
		buyTokens(ethForTokenPurchase);
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
