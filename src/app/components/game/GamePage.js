import React, { Component } from 'react';
import { connect } from 'react-redux';
import Web3 from 'web3';
import {
	fetchHashedServerSeed,
	setClientSeed,
	resetBet
} from '../../actions/gameActions';
import {
	pushNewGame,
	setInitOccurence,
	setFailure
} from '../../actions/resultsActions';
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
		clientSeed: state.game.clientSeed,
	}),	{
		fetchHashedServerSeed,
		setClientSeed,
		resetBet,
		pushNewGame,
		setInitOccurence,
		setFailure
	}
)
export default class GamePage extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.fetchHashedServerSeed();
		this.props.setClientSeed(generateRandomString());
	}

	handleBetReset = () => {
		this.props.resetBet();
	}

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
			hashedServerSeed,
			fetchHashedServerSeed,
			pushNewGame,
			setInitOccurence,
			setFailure
		} = this.props;

		if(metamaskMode && isWeb3Injected) {
			const web3 = new Web3(injectedWeb3.currentProvider);
			const gameInstance = new web3.eth.Contract(gameABI, gameAddress);

			const {
				contractInput,
				totalEther
			} = generateBettingInput(betState);

			const game = gameInstance
				.methods
				.initGame(
					hashedServerSeed,
					stringToBytes32(clientSeed),
					contractInput
				)
				.send({
					from: wallet,
					value: toWei(totalEther)
				});

			game
				.once('transactionHash', txHash => {
					// Push to History
					pushNewGame({
						initGameTxHash: txHash,
						hasFailed: false,
						initTransacted: false,
						finalized: false,
						clientSeed,
						serverSeed: '',
						hashedServerSeed,
						reward: ''
					});

					fetchHashedServerSeed();
				})
				.once('confirmation', (confNumber, receipt) => {
					setInitOccurence(hashedServerSeed, true);
				})
				.on('error', error => {
					setFailure(hashedServerSeed, true);
					fetchHashedServerSeed();
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
