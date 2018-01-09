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

	

	render() {
		const {
			hashedServerSeed,
			clientSeed,
			betMoney,
			getGameResult,
			fetchHashedServerSeed
		} = this.props;
		
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
					<button onClick={getGameResult}>Play</button>

					<div className="text-center">
						<span style={{fontSize: 32}}>1</span>
						
					</div>
					
					
				</div>
			</div>
		);
	}
}
