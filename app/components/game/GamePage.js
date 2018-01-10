import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	fetchHashedServerSeed,
	setClientSeed,
	setBetMoney,
	setBetSide,
	getGameResult
} from '../../actions/gameActions';
import { generateRandomHex, getRandom, toWei } from '../../utils/misc'

import { abi as gameAbi } from '../../../build/contracts/OddEven.json';


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
			prevClientSeed: '',
			prevHashedServerSeed: '',
			prevBetMoney: '',
			prevBetSide: ''
		};
	}

	componentDidMount() {
		this.props.fetchHashedServerSeed();
		this.props.setClientSeed(generateRandomHex());
	}

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
			betSide,
			betMoney,
			playerWin
		} = res

		const gameInstance = new web3.eth.Contract(gameAbi, '0xf204a4ef082f5c04bb89f7d5e6568b796096735a');
		await gameInstance
			.methods
			.initGame(gameId, hashedServerSeed, clientSeed, betSide)
			.send({
				from: account, 
				value: toWei(betMoney)
			});

		
		const result = getRandom(serverSeed, clientSeed);

		

		this.setState({
			prevServerSeed: serverSeed,
			prevClientSeed: clientSeed,
			prevResult: result,
			prevBetSide: betSide,
			prevBetMoney: betMoney,
			prevHashedServerSeed: this.props.hashedServerSeed
		});

		this.props.fetchHashedServerSeed();
		this.props.setClientSeed(generateRandomHex());
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
			<div className="panel panel-default">
				<div className="panel-body">
					<h4>Game - 0 or 1</h4>
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
					<button onClick={this.handlePlayBtnClick}>Play</button>

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
		);
	}
}
