import React, { Component } from 'react';
import classNames from 'classnames';
import web3 from '../../utils/web3';
import {
	gameAddress,
	gameABI
} from '../../../common/constants/contracts';
import GamePage from '../game/GamePage';
import ValidationSection from '../game/ValidationSection';



export default class MainPage extends Component {
	constructor(props) {
		super(props);
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

	handleInputChange(whichState, evt) {
		const newVal = evt.target.value;

		this.setState({ [whichState]: newVal });
	}


    render() {
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
