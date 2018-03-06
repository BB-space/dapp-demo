import React, { Component } from 'react';
import { connect } from 'react-redux';
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
	reconstructResult,
	toWei,
	asciiToHex,
	stringToBytes32,
	generateBettingInput
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
		account: state.ethState.currentAccount,
		metamaskAccount: state.auth.metamaskAccount,
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
		// this.watchContractOddEvenPlayGame();
		// this.watchContractOddEven();
	}

	handleBetReset = () => {
		this.props.resetBet();
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


	handlePlayBtnClick = async (evt) => {
		const {
			metamaskMode,
			isWeb3Injected,
			betState,
			clientSeed,
			metamaskAccount,
			setIsPlaying
		} = this.props;

		if(metamaskMode && isWeb3Injected) {
			const gameInstance = new injectedWeb3.eth.Contract(gameABI, gameAddress);
			let _hash1 = await gameInstance.methods.getHash(0).call();

			const {
				contractInput,
				totalEther
			} = generateBettingInput(betState);

			const game = gameInstance
				.methods
				.initGame(
					_hash1,
					stringToBytes32(clientSeed),
					contractInput
				)
				.send({
					from: metamaskAccount,
					value: toWei(totalEther)
				});

			game.on('transactionHash', hash => {
				setIsPlaying(hash);
			})

			




		} else {

		}



		/* const res = await this.props.getGameResult();
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
		   this.props.setClientSeed(generateRandomString());*/
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

						<Results/>


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
