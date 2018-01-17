import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { getAccountStatus } from '../../actions/ethStateActions';
import { fromWei, toWei } from '../../utils/misc';
import { issuerAddress,
		 tokenAddress,
		 gameAddress } from '../../constants/addresses';
import GamePage from '../game/GamePage';
import TokenPurchaseSection from '../token/TokenPurchaseSection';
import ValidationSection from '../game/ValidationSection';


import {abi as tulipABI} from '../../../build/contracts/Tulip.json';



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
		this.handleTokenAddressChange = this.handleInputChange.bind(this, 'tokenAddress');
		this.handleTlpForTransferChange = this.handleInputChange.bind(this, 'tlpForTransfer');
		this.handleTlpRecipientChange = this.handleInputChange.bind(this, 'tlpRecipient');

		this.state = {
			tokenAddress,
			tlpForTransfer: 0,
			tlpRecipient: '',
			issuerBalance: 0
		};

		this.refreshStatus();
    }

	refreshStatus = async () => {
		const issuerBalance = await web3.eth.getBalance(issuerAddress);
		this.props.getAccountStatus(tokenAddress);
		this.setState({
			issuerBalance
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
			tokenAddress,
			tlpForTransfer,
			tlpRecipient,
			issuerBalance
		} = this.state;

		return (
			<main>
				<div className="page-header">
					<h1>Sample Dapp</h1>
				</div>
				<div className="row">

					<div className="col-md-6">
						<div className="panel panel-default">
							<div className="panel-heading">
								계좌 정보
							</div>
							<div className="panel-body">

								<ul>
									<li>내 계좌 주소: {currentAccount || 'Not Connected'}</li>
									<li>ETH 잔고: {fromWei(ethBalance).toString() || '0.0'}</li>
									<li>내 토큰 잔고: {fromWei(tokenBalance).toString() || '0.0'}</li>

									<li>Send {' '}
										<input value={tlpForTransfer}
											   onChange={this.handleTlpForTransferChange} />
										TLP {' '}
										to {' '}
										<input value={tlpRecipient}
											   onChange={this.handleTlpRecipientChange} />
										{' '}
										<button
											className="btn btn-sm btn-default"
											onClick={this.sendTLP}>Send</button>
									</li>
									
									<li>토큰 발행인 ETH 잔고: {fromWei(issuerBalance).toString() || '0.0'}</li>
									<button
										className="btn btn-default pull-right"
										onClick={this.refreshStatus}>Refresh</button>
								</ul>
							</div>
						</div>
					</div>

					<div className="col-md-6">
						<TokenPurchaseSection />
					</div>
				</div>
				
				<div>
					<GamePage />
					<ValidationSection />
				</div>
			</main>
		);
    }
}
