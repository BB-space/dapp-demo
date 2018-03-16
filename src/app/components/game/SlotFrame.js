import React, { Component } from 'react';
import { connect } from 'react-redux';
import Web3 from 'web3';
import { fetchHashedServerSeed } from '../../actions/gameActions';
import {
	pushNewGame,
	setInitOccurence,
	setFailure
} from '../../actions/resultsActions';
import { setFinalized } from '../../actions/resultsActions';
import {
	stringToBytes32,
	generateBettingInput,
	toWei,
	fromWei,
	bytesToString
} from '../../../common/utils';
import { injectedWeb3, serviceWeb3 } from '../../utils/web3';
import {
	gameAddress,
	gameABI
} from '../../../common/constants/contracts';


@connect(
	(state, ownProps) => ({
		metamaskMode: state.auth.metamaskMode,
		isWeb3Injected: state.auth.isWeb3Injected,
		betState: state.game.betState,
		wallet: state.auth.wallet,
		hashedServerSeed: state.game.hashedServerSeed,
		clientSeed: state.game.clientSeed,
		gameResults: state.results
	}),	{
		fetchHashedServerSeed,
		pushNewGame,
		setInitOccurence,
		setFailure,
		setFinalized
	}
)
export default class SlotFrame extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		window.addEventListener('OnStartGame', this.handleStartGame);
		window.addEventListener('OnClickBetUp', this.handleBetUp);
		window.addEventListener('OnClickBetDown', this.handleBetDown);
		window.addEventListener('OnClickBetMax', this.handleBetMax);
		window.addEventListener('OnClickSpin', this.handleSpinBtnClick);

		const gameInstance = new serviceWeb3.eth.Contract(gameABI, gameAddress);
		gameInstance.events.Finalize(this.handleFinalize);

	}

	componentWillUnmount() {
		window.removeEventListener('OnStartGame', this.handleStartGame);
		window.removeEventListener('OnClickBetUp', this.handleBetUp);
		window.removeEventListener('OnClickBetDown', this.handleBetDown);
		window.removeEventListener('OnClickBetMax', this.handleBetMax);
		window.removeEventListener('OnClickSpin', this.handleSpinBtnClick);
	}

	shouldComponentUpdate() {
		return false;
	}

	componentWillReceiveProps(nextProps) {

	}

	handleStartGame = e => {
		console.log('set bet range');
		this.ifr.contentWindow.c2_callFunction('InitBetRange', [1000, 5000, 10000, 50000, 100000, 500000]);
	}

	handleBetUp = e => {
		console.log('OnClickBetUp');
		this.ifr.contentWindow.c2_callFunction('PressBetUp', []);
	}

	handleBetDown = e => {
		console.log('OnClickBetDown');
		this.ifr.contentWindow.c2_callFunction('PressBetDown', []);
	}

	handleBetMax = e => {
		console.log('OnClickBetMax');
		this.ifr.contentWindow.c2_callFunction('PressMaxBet', []);
	}

	handleSpinBtnClick = async (evt) => {
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

		console.log('OnClickSpin');
		this.ifr.contentWindow.c2_callFunction('PressSpin', []);


		if(metamaskMode && isWeb3Injected) {
			const web3 = new Web3(injectedWeb3.currentProvider);
			const gameInstance = new web3.eth.Contract(gameABI, gameAddress);

			const {
				contractInput,
				totalEther
			} = generateBettingInput({
				big: 0.1
			});

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

					// Fetch a new dealer hash
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

	handleFinalize = (err, res) => {
		if(!err) {
			const { transactionHash } = res;
			const {
				gameResults,
				setFinalized
			} = this.props;
			const {
				clientSeed,
				dealerSeed,
				hashedDealerSeed,
				reward
			} = res.returnValues;


			if(gameResults.find(record =>
				record.hashedServerSeed
				=== hashedDealerSeed
			)) {
				this.ifr.contentWindow.c2_callFunction(
					"FinishSpinWithValue",
					[0, 0, 0]
				);
				
				setFinalized(
					hashedDealerSeed,
					true,
					bytesToString(dealerSeed),
					fromWei(reward).toString()
				);
			}
		}
	}

	render() {
		return (
			<div>
				<iframe
					ref={f => {this.ifr = f;}}
					src="/dist/h5slot/index.html"
					name="game"
					id="game"
					width="100%"
					height="480px"
					frameBorder="0"
					scrolling="no">
					<p>Your browser does not support iframes</p>
				</iframe>
			</div>
		);
	}
}
