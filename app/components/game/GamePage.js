import React, { Component } from 'react';
import { connect } from 'react-redux';
import MersenneTwister from 'mersenne-twister';
import {
	fetchHashedServerSeed,
	setClientSeed,
	setBetMoney,
	getGameResult
} from '../../actions/gameActions';
import { generateRandomHex } from '../../utils/misc'


const mt = new MersenneTwister();

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

	

	render() {
		const {
			hashedServerSeed,
			clientSeed,
			betMoney,
			getGameResult
		} = this.props;
		
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<div>Game</div>
					<div><b>Hashed Server Seed</b>: { hashedServerSeed }</div>
					<div>
						<b>Client Seed</b><span>: {' '}</span>
						<input value={clientSeed}
							   onChange={this.handleClientSeedChange} />
					</div>
					<div>
						<b>Betting Tulip</b><span>: {' '}</span>
						<input value={betMoney}
							   onChange={this.handleBetMoneyChange} />
					</div>
					<button onClick={getGameResult}>Play</button>
				</div>
			</div>
		);
	}
}
