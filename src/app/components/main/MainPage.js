import React, { Component } from 'react';
import classNames from 'classnames';
import web3 from '../../utils/web3';
import {
	gameAddress,
	gameABI
} from '../../../common/constants/contracts';
import GamePage from '../game/GamePage';
import TokenPurchaseSection from '../token/TokenPurchaseSection';
import ValidationSection from '../game/ValidationSection';



export default class MainPage extends Component {
	constructor(props) {
		super(props);

		
		this.handleTokenAddressChange = this.handleInputChange.bind(this, 'tokenAddress');
		this.handleTlpForTransferChange = this.handleInputChange.bind(this, 'tlpForTransfer');
		this.handleTlpRecipientChange = this.handleInputChange.bind(this, 'tlpRecipient');
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

		return (
			<main className="page-container">
				<div className="row">
					<GamePage />
					<ValidationSection />
				</div>
			</main>
		);
    }
}
