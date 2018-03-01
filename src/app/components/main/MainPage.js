import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { getAccountStatus } from '../../actions/ethStateActions';
import { fromWei, toWei } from '../../../common/utils';
import web3 from '../../utils/web3';
import {
	tokenAddress,
	tokenSaleAddress,
	gameAddress,
	tokenABI,
	tokenSaleABI,
	gameABI
} from '../../../common/constants/contracts';
import GamePage from '../game/GamePage';
import TokenPurchaseSection from '../token/TokenPurchaseSection';
import ValidationSection from '../game/ValidationSection';



@connect(
	(state, ownProps) => ({
		isAuthenticated: state.auth.isAuthenticated,
		wallet: state.auth.wallet,
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
			tlpRecipient: ''
		};

		this.refreshStatus();
	}

	componentDidMount(){
		//this.watchContractOddEven();
		//this.watchContractCrowdSale();
	}
	
	/* watchContractOddEven(){
	   const oddEven = new web3.eth.Contract(gameABI,gameAddress)
	   oddEven.events.allEvents(
	   (error, result)=>{
	   if(error){
	   console.log("error",error);
	   } else {
	   this.refreshStatus();
	   }
	   }
	   )
	   }
	   watchContractCrowdSale(){
	   const tokenSale = new web3.eth.Contract(tokenSaleABI, tokenSaleAddress)
	   tokenSale.events.allEvents(
	   (error, result)=>{
	   if(error){
	   console.log("error",error);
	   } else{
	   this.refreshStatus();
	   }
	   }
	   )
	   }*/
	refreshStatus = () => {
		this.props.getAccountStatus(tokenAddress);
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

		// const tokenInstance = new web3.eth.Contract(tulipABI, tokenAddress);

		/* tokenInstance
		   .methods
		   .transfer(tlpRecipient, toWei(tlpForTransfer))
		   .send({
		   from: currentAccount
		   });*/
	}

	handleInputChange(whichState, evt) {
		const newVal = evt.target.value;

		this.setState({ [whichState]: newVal });
	}


    render() {
		const {
			isAuthenticated,
			wallet,
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
			<main className="page-container">
				<div className="row">
					<div className="col-md-12">
						<div className="panel panel-default">
							<div className="panel-heading">
								계좌 정보
							</div>
							<div className="panel-body">

								<ul>
									<li>내 계좌 주소: {isAuthenticated ? wallet : 'Not Connected'}</li>
									<li>ETH 잔고: {fromWei(ethBalance).toString() || '0.0'}</li>
									<li>내 토큰 잔고: {fromWei(tokenBalance).toString() || '0.0'}</li>
									
									<button
										className="btn btn-default pull-right"
										onClick={this.refreshStatus}>Refresh</button>
								</ul>
							</div>
						</div>
					</div>


				</div>

				<div className="row">
					<GamePage />
					<ValidationSection />
				</div>
			</main>
		);
    }
}
