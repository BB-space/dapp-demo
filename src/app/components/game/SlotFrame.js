import React, { Component } from 'react';
import { connect } from 'react-redux';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import {
	fetchHashedServerSeed,
	setBetIndex
} from '../../actions/gameActions';
import {
	pushNewGame,
	setInitOccurence,
	setFailure,
	setFinalized
} from '../../actions/resultsActions';
import { fetchBalanceInEth } from '../../actions/authActions';
import {
	stringToBytes32,
	generateBettingInput,
	toWei,
	fromWei,
	bytesToString,
	reconstructResult
} from '../../../common/utils';
import {
	injectedWeb3,
	serviceWeb3
} from '../../utils/web3';
import {
	gameAddress,
	gameABI
} from '../../../common/constants/contracts';
import {
	payTableData,
	betRange,
	ethToCreditRate
} from '../../../common/constants/game';


@connect(
	(state, ownProps) => ({
		metamaskMode: state.auth.metamaskMode,
		isWeb3Injected: state.auth.isWeb3Injected,
		wallet: state.auth.wallet,
		ethBalance: state.auth.ethBalance,
		hashedServerSeed: state.game.hashedServerSeed,
		clientSeed: state.game.clientSeed,
		gameHistory: state.results
	}),	{
		fetchHashedServerSeed,
		pushNewGame,
		setInitOccurence,
		setFailure,
		setFinalized,
		setBetIndex,
		fetchBalanceInEth
	}
)
export default class SlotFrame extends Component {
	constructor(props) {
		super(props);

		this.handleClickSpin = this.handleSpin.bind(this, 'PressSpin');
		this.handlePullLever = this.handleSpin.bind(this, 'PullLever');
	}

	componentDidMount() {
		window.addEventListener('OnInitGame', this.handleGameLoad);
		window.addEventListener('OnClickBetUp', this.handleBetUp);
		window.addEventListener('OnClickBetDown', this.handleBetDown);
		window.addEventListener('OnClickBetMax', this.handleBetMax);
		window.addEventListener('OnClickSpin', this.handleClickSpin);
		window.addEventListener('OnPullLever', this.handlePullLever);

		const gameInstance = new serviceWeb3.eth.Contract(gameABI, gameAddress);
		gameInstance.events.Finalize(this.handleFinalize);
	}

	componentWillUnmount() {
		window.removeEventListener('OnInitGame', this.handleGameLoad);
		window.removeEventListener('OnClickBetUp', this.handleBetUp);
		window.removeEventListener('OnClickBetDown', this.handleBetDown);
		window.removeEventListener('OnClickBetMax', this.handleBetMax);
		window.removeEventListener('OnClickSpin', this.handleClickSpin);
		window.removeEventListener('OnPullLever', this.handlePullLever);
	}

	shouldComponentUpdate() {
		return false;
	}

	componentWillReceiveProps(nextProps) {

	}

	handleGameLoad = evt => {
		// Set bet range
		this.ifr.contentWindow.c2_callFunction('SetBetRange', betRange);
		
		// set pay table
		const payTable = {
			c2array: true,
			size: [19, 4, 1],
			data: payTableData
		};
		
		this.ifr.contentWindow.c2_callFunction('SetPayTable', [JSON.stringify(payTable)]);
		const table = this.ifr.contentWindow.c2_callFunction('GetPayTable', []);
		console.log('PayTable:', table);

		// set balance
		const { ethBalance } = this.props;
		console.log(ethBalance);
		this.setBalanceInGame(
			BigNumber(ethBalance).times(ethToCreditRate).toNumber()
		);

		// start game
		this.ifr.contentWindow.c2_callFunction('StartGame', []);
	}

	handleBetUp = evt => {
		console.log('OnClickBetUp');
		this.ifr.contentWindow.c2_callFunction('PressBetUp', []);
		this.syncBetIndex();
	}

	handleBetDown = evt => {
		console.log('OnClickBetDown');
		this.ifr.contentWindow.c2_callFunction('PressBetDown', []);
		this.syncBetIndex();
	}

	handleBetMax = evt => {
		console.log('OnClickBetMax');
		this.ifr.contentWindow.c2_callFunction('PressMaxBet', []);
		this.syncBetIndex();
	}

	handleSpin = async (inGamefunc, evt) => {
		const {
			metamaskMode,
			isWeb3Injected,
			wallet,			
			clientSeed,
			hashedServerSeed,
			fetchHashedServerSeed,
			pushNewGame,
			setInitOccurence,
			setFailure,
			fetchBalanceInEth
		} = this.props;


		if(metamaskMode && isWeb3Injected) {
			const web3 = new Web3(injectedWeb3.currentProvider);
			const gameInstance = new web3.eth.Contract(gameABI, gameAddress);
			const betInEth = new BigNumber(betRange[this.getBetIndex()]).dividedBy(ethToCreditRate).toString();


			const game = gameInstance
				.methods
				.initGame(
					hashedServerSeed,
					stringToBytes32(clientSeed),
					1
				)
				.send({
					from: wallet,
					value: toWei(betInEth)
				});

			this.ifr.contentWindow.c2_callFunction(inGamefunc, []);

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
						betInEth,
						reward: ''
					});

					// Fetch a new dealer hash
					fetchHashedServerSeed();
				})
				.once('confirmation', async (confNumber, receipt) => {
					setInitOccurence(hashedServerSeed, true);
					this.fetchAndSetBalance();
				})
				.on('error', error => {
					this.fetchAndSetBalance();
					this.finishSpinWithValue([1,2,3]);
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
				gameHistory,
				setFinalized
			} = this.props;
			const {
				player,
				clientSeed,
				serverSeed,
				serverHash,
				reward
			} = res.returnValues;
			
			const symbolIndices = reconstructResult(
				serverSeed,
				clientSeed,
				false
			);

			if(gameHistory.find(record =>
				record.hashedServerSeed
				=== serverHash
			)) {
				this.finishSpinWithValue(symbolIndices);
				
				setFinalized(
					serverHash,
					true,
					symbolIndices,
					bytesToString(serverSeed),
					fromWei(reward).toString()
				);
			}
		}
	}

	fetchAndSetBalance = async () => {
		const {
			wallet,
			fetchBalanceInEth
		} = this.props;
		
		const balanceInEth = await fetchBalanceInEth(wallet);
		// set balance in game
		this.setBalanceInGame(
			BigNumber(balanceInEth)
				.times(ethToCreditRate)
				.toNumber()
		);  

		return balance;
	}

	setBalanceInGame = (creditBalance) => {
		this.ifr.contentWindow.c2_callFunction(
			'SetBalance',
			[creditBalance]
		);
	}

	getBetIndex = () => {
		return this.ifr.contentWindow.c2_callFunction('GetBetIndex', []);
	}

	syncBetIndex = () => {
		const betIdx = this.getBetIndex();
		this.props.setBetIndex(betIdx);
	}

	finishSpinWithValue(values) {
		this.ifr.contentWindow.c2_callFunction(
			'FinishSpinWithValue',
			values
		);
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
