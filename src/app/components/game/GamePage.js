import React, { Component } from 'react';
import { connect } from 'react-redux';
import Web3 from 'web3';
import {
	fetchHashedServerSeed,
	setClientSeed,
	getGameResult,
	resetBet
} from '../../actions/gameActions';
import {
	setIsPlaying
} from '../../actions/resultActions';
import {
	generateRandomString,
	stringToBytes32,
	generateBettingInput,
	toWei
} from '../../../common/utils';
import { injectedWeb3 } from '../../utils/web3';
import {
	gameAddress,
	gameABI
} from '../../../common/constants/contracts';
import BetTable from './BetTable';
import BetBoard from './BetBoard';
import Chips from './Chips';
import Results from './Results';


@connect(
	(state, ownProps) => ({
		metamaskMode: state.auth.metamaskMode,
		isWeb3Injected: state.auth.isWeb3Injected,
		betState: state.game.betState,
		wallet: state.auth.wallet,
		hashedServerSeed: state.game.hashedServerSeed,
		clientSeed: state.game.clientSeed
	}),	{
		fetchHashedServerSeed,
		setClientSeed,
		resetBet,
		getGameResult,
		setIsPlaying
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
	}

	handleBetReset = () => {
		this.props.resetBet();
	}

	/* watchContractOddEven() {
	   const oddEven = new web3.eth.Contract(gameABI,gameAddress)
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
	   }*/

	/* watchContractOddEvenPlayGame(){
	   const oddEven = new web3.eth.Contract(gameABI,gameAddress)
	   const events = oddEven.events;
	   events.PlayGame((error,result)=>{
	   console.log("error",error)
	   console.log("result",result)
	   })
	   }*/

	handleClientSeedChange = (evt) => {
		const newVal = evt.target.value;
		this.props.setClientSeed(newVal);
	}


	handlePlayBtnClick = async (evt) => {
		const {
			metamaskMode,
			isWeb3Injected,
			wallet,			
			betState,
			clientSeed,
			setIsPlaying
		} = this.props;

		if(metamaskMode && isWeb3Injected) {
			const web3 = new Web3(injectedWeb3.currentProvider);
			const gameInstance = new web3.eth.Contract(gameABI, gameAddress);
			const hash = await gameInstance.methods.getHash(0).call();

			const {
				contractInput,
				totalEther
			} = generateBettingInput(betState);

			const game = gameInstance
				.methods
				.initGame(
					hash,
					stringToBytes32(clientSeed),
					contractInput
				)
				.send({
					from: wallet,
					value: toWei(totalEther)
				});

			game
				.once('transactionHash', hash => {
					setIsPlaying(hash);
				});

		} else {
			
		}
	}

	getDiceComponent(numbers) {
		return (
			<div className="dice-box">
				{ numbers.map((n, idx) => (
					<Dice key={idx} face={n} />
				)) }
			</div>
		);
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
			selectedChipIdx,

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
		const win = result === "not bet" ? "" : result % 2 == parseInt(prevBetSide) ? "win" : "lose"

		return (
			<div className="col-md-12">
				<div className="panel panel-default">
					<div className="panel-heading">
					</div>
					<div className="panel-body">


						<BetTable
							handleBetReset={this.handleBetReset}
							handlePlayBtnClick={this.handlePlayBtnClick}
						/>

						<Results />

						<font className="heading">
							배팅 변경
						</font>
						
						<ul>
							<li>
								<b>Hashed Server Seed</b>
								<span>: { hashedServerSeed } </span>
								<button onClick={fetchHashedServerSeed}>다른 해시 불러오기</button>
							</li>
							<li>
								<b>Client Seed</b><span>: {' '}</span>
								<input value={clientSeed}
									   onChange={this.handleClientSeedChange} />
							</li>

						</ul>
					</div>
					<hr/>
				</div>
			</div>
		);
	}
}
