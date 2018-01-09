import React, { Component } from 'react';
import { connect } from 'react-redux';
import MersenneTwister from 'mersenne-twister';
import {
	fetchHashedServerSeed,
	setClientSeed,
	setBetMoney,
	getGameResult
} from '../../actions/gameActions';
import { generateRandomHex, getRandom } from '../../utils/misc'




@connect(
	(state, ownProps) => ({
		hashedServerSeed: state.game.hashedServerSeed,
		clientSeed: state.game.clientSeed,
		betMoney: state.game.betMoney
	}),	{
		fetchHashedServerSeed,
		setClientSeed,
		setBetMoney,
		getGameResult
	}
)
export default class GamePage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			prevGameResult: '',
			prevGameServerSeed: '',
			prevGameClientSeed: '',
			prevGameHashedServerSeed: ''
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

	handlePlayBtnClick = async (evt) => {
		const res = await this.props.getGameResult();
		const {
			serverSeed,
			clientSeed
		} = res
		const result = getRandom(serverSeed, clientSeed);

		this.setState({
			prevGameServerSeed: serverSeed,
			prevGameClientSeed: clientSeed,
			prevGameResult: result,
			prevGameHashedServerSeed: this.props.hashedServerSeed
		});
	}

	render() {
		const {
			hashedServerSeed,
			clientSeed,
			betMoney,
			fetchHashedServerSeed
		} = this.props;

		const {
			prevGameResult,
			prevGameServerSeed,
			prevGameClientSeed,
			prevGameHashedServerSeed
		} = this.state;
		
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<h4>Game - 0 or 1</h4>
					<ul>
						<li>
							<b>Hashed Server Seed</b>
							<span>: { hashedServerSeed } </span>
							<button onClick={fetchHashedServerSeed}>Get Another One</button>
						</li>
						<li>
							<b>Client Seed</b><span>: {' '}</span>
							<input value={clientSeed}
								   onChange={this.handleClientSeedChange} />
						</li>
						<li>
							<b>Betting Tulip</b><span>: {' '}</span>
							<input value={betMoney}
								   onChange={this.handleBetMoneyChange} />
						</li>
					</ul>
					<button onClick={this.handlePlayBtnClick}>Play</button>

					<div className="text-center">
						<div>Result:</div>
						<span style={{fontSize: 32}}>{prevGameResult}</span>
						
					</div>

					<div className="text-center">
						<div>Client Seed: {prevGameClientSeed}</div>
						<div>Server Seed: {prevGameServerSeed}</div>
						<div>Server Seed(Hashed): {prevGameHashedServerSeed}</div>
					</div>
					
				</div>
			</div>
		);
	}
}
