import React, { Component } from 'react';
import { connect } from 'react-redux';
import Web3 from 'web3';
import {
	fetchHashedServerSeed,
	setClientSeed,
	setBetMoney,
	setBetSide,
	getGameResult
} from '../../actions/gameActions';
import {
	generateRandomString,
	reconstructResult,
	toWei,
	asciiToHex
} from '../../utils/misc';
import {
	gameAddress,
	tokenAddress
} from '../../constants/addresses';

import { abi as gameAbi } from '../../../build/contracts/OddEven.json';
import { abi as tokenAbi } from '../../../build/contracts/Tulip.json';
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://10.30.192.28:8545'));
//clientSeed 를 무조건 hex of length 64 로 강제 하고 있는데 ui가 별로면 sha3 태운걸로 하면됨


@connect(
	(state, ownProps) => ({
		account: state.ethState.currentAccount,
		hashedServerSeed: state.game.hashedServerSeed,
		clientSeed: state.game.clientSeed,
		betSide: state.game.betSide,
		betMoney: state.game.betMoney
	}),	{
		fetchHashedServerSeed,
		setClientSeed,
		setBetMoney,
		setBetSide,
		getGameResult
	}
)
export default class GamePage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			prevResult: '',
			prevServerSeed: '',
			prevServerSeedBytes32: '',
			prevClientSeed: '',
			prevClientSeedBytes32: '',
			prevHashedServerSeed: '',
			prevBetMoney: '',
			prevBetSide: ''
		};
	}

	componentDidMount() {
		this.props.fetchHashedServerSeed();
		this.props.setClientSeed(generateRandomString());
		// this.watchContractOddEvenPlayGame();
		this.watchContractOddEven();
	}
	watchContractOddEven(){
		const oddEven = new web3.eth.Contract(gameAbi,gameAddress)
		oddEven.events.allEvents(
			(error, result)=>{
				if(error){
					console.log("error",error);
				}else{
					console.log("=======================")
					console.log("event",result.event)
					console.log("returnValues",result.returnValues)
					console.log("=======================")
				}
			}
		)
	}

	// watchContractOddEvenPlayGame(){
	// 	const oddEven = new web3.eth.Contract(gameAbi,gameAddress)
	// 	const events = oddEven.events;
	// 	events.PlayGame((error,result)=>{
	// 		console.log("error",error)
	// 		console.log("result",result)
	// 	})
	// }

	handleClientSeedChange = (evt) => {
		const newVal = evt.target.value;
		this.props.setClientSeed(newVal);
	}

	handleBetMoneyChange = (evt) => {
		const newVal = evt.target.value;
		this.props.setBetMoney(newVal);
	}

	handleBetSideChange = (evt) => {
		const newVal = evt.target.value;
		this.props.setBetSide(newVal);
	}

	handlePlayBtnClick = async (evt) => {
		const res = await this.props.getGameResult();
		const { hashedServerSeed, account } = this.props;
		const {
			gameId,
			serverSeed,
			clientSeed,
			clientSeedBytes32,
			serverSeedBytes32,
			betSide,
			betMoney,
			playerWin
		} = res;

		const result = reconstructResult(serverSeed, clientSeed);

		this.setState({
			prevGameId: gameId,
			prevServerSeed: serverSeed,
			prevServerSeedBytes32: serverSeedBytes32,
			prevClientSeed: clientSeed,
			prevClientSeedBytes32: clientSeedBytes32,
			prevResult: result,
			prevBetSide: betSide,
			prevBetMoney: betMoney,
			prevHashedServerSeed: this.props.hashedServerSeed
		});

		this.props.fetchHashedServerSeed();
		this.props.setClientSeed(generateRandomString());
	}

	handleClickFinalze = async (evt) => {
		const {
			gameInstance,
			prevServerSeedBytes32,
			prevResult,
			prevBetSide,
			prevGameId
		} = this.state;

		const {
			account
		} = this.props;

		const win = parseInt(prevResult) === parseInt(prevBetSide);

		await gameInstance
			.methods
			.finalize(
				prevGameId,
				prevServerSeedBytes32,
				win
			)
			.send({from: account});
	}

	render() {
		const {
			hashedServerSeed,
			clientSeed,
			betSide,
			betMoney,
			fetchHashedServerSeed
		} = this.props;

		const {
			prevResult,
			prevServerSeed,
			prevClientSeed,
			prevBetSide,
			prevBetMoney,
			prevHashedServerSeed
		} = this.state;

		return (
			<div className="col-md-12">
				<div className="panel panel-default">
					<div className="panel-heading">
						Game - 0 or 1
					</div>
					<div className="panel-body">

						<ul>
							<li>
								<b>Hashed Server Seed</b>
								<span>: { hashedServerSeed } </span>
								<button onClick={fetchHashedServerSeed}>Get Other One</button>
							</li>
							<li>
								<b>Client Seed</b><span>: {' '}</span>
								<input value={clientSeed}
									   onChange={this.handleClientSeedChange} />
							</li>
							<li>
								<div><b>Your Bet:</b></div>
								<input value={betMoney}
									   onChange={this.handleBetMoneyChange} /> TLP on {' '}
								<input type="radio"
									   name="gender"
									   value="0"
									   onChange={this.handleBetSideChange}
									   checked={betSide === '0'} />0
								{' or '}
								<input type="radio"
									   name="gender"
									   value="1"
									   onChange={this.handleBetSideChange}
									   checked={betSide === '1'}/>1
							</li>
						</ul>
						<button
							className="btn btn-default"
							onClick={this.handlePlayBtnClick}>Play</button>

						<div className="text-center">
							<div>Result:</div>
							<span style={{fontSize: 32}}>{prevResult}</span>
						</div>

						<div className="text-center">
							<div>Client Seed: {prevClientSeed}</div>
							<div>Server Seed: {prevServerSeed}</div>
							<div>Server Seed (Hashed): {prevHashedServerSeed}</div>
							<div>Your Bet Side: {prevBetSide}</div>
							<div>Your Bet Money: {prevBetMoney}</div>
						</div>

					</div>
				</div>
			</div>
		);
	}
}
