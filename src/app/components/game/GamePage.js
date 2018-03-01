import React, { Component } from 'react';
import { connect } from 'react-redux';
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
} from '../../../common/utils';
import web3 from '../../utils/web3';
import {
	gameAddress,
	tokenAddress,
	gameABI,
	tokenABI
} from '../../../common/constants/contracts';




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
			prevResult: [],
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
		// this.watchContractOddEven();
	}
	
	watchContractOddEven(){
		/* const oddEven = new web3.eth.Contract(gameABI,gameAddress)
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
		   )*/
	}

	// watchContractOddEvenPlayGame(){
	// 	const oddEven = new web3.eth.Contract(gameABI,gameAddress)
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

	getDiceComponent(numbers) {
		const dices = [
			(
				<div className="first-face">
					<span className="pip" />
				</div>
			), (
				<div className="second-face">
					<span className="pip" />
					<span className="pip" />
				</div>
			), (
				<div className="third-face">
					<span className="pip" />
					<span className="pip" />
					<span className="pip" />
				</div>
			), (
				<div className="fourth-face">
					<div className="column">
						<span className="pip" />
						<span className="pip" />
					</div>
					<div className="column">
						<span className="pip" />
						<span className="pip" />
					</div>
				</div>
			), (
				<div className="fifth-face">
					<div className="column">
						<span className="pip" />
						<span className="pip" />
					</div>
					<div className="column">
						<span className="pip" />
					</div>
					<div className="column">
						<span className="pip" />
						<span className="pip" />
					</div>
				</div>
			), (
				<div className="sixth-face">
					<div className="column">
						<span className="pip" />
						<span className="pip" />
						<span className="pip" />
					</div>
					<div className="column">
						<span className="pip" />
						<span className="pip" />
						<span className="pip" />
					</div>
				</div>
			)
		];

		return (
			<div className="dice-box">
				{ numbers.map(e => dices[e-1]) }
			</div>
		)
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
		const result = prevResult.length === 3 ? prevResult.reduce((a,b)=>{return a+b}) : "not bet"
		const resultText = result==="not bet" ? "" : result % 2 === 1 ? "odd" :"even"
		const prevBetSideText = parseInt(prevBetSide) === 1 ? "odd" : parseInt(prevBetSide) === 0 ? "even" : ""
		const win = result === "not bet" ? "" : result % 2 == parseInt(prevBetSide) ? "win" : "loose"
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
									   checked={betSide === '0'} />Even
								{' or '}
								<input type="radio"
									   name="gender"
									   value="1"
									   onChange={this.handleBetSideChange}
									   checked={betSide === '1'}/>Odd
							</li>
						</ul>
						<button
							className="btn btn-default"
							onClick={this.handlePlayBtnClick}>Play</button>

						<div className="text-center">
							<div>Result:</div>
							{ this.getDiceComponent(prevResult) }

							<span style={{fontSize: 32}}>
								{result} ({resultText})
							</span>
						</div>

						<div className="text-center">
							<div style={{fontSize:30}}>Your Bet Side: {prevBetSideText} ({win})</div>
							<div style={{fontSize:30}}>Your Bet Money: {prevBetMoney}</div>
							<div>Client Seed: {prevClientSeed}</div>
							<div>Server Seed: {prevServerSeed}</div>
							<div>Server Seed (Hashed): {prevHashedServerSeed}</div>
						</div>

					</div>
				</div>
			</div>
		);
	}
}
