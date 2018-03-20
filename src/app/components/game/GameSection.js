import React, { Component } from 'react';
import { connect } from 'react-redux';
import Web3 from 'web3';
import {
	fetchHashedServerSeed,
	setClientSeed,
	resetBet
} from '../../actions/gameActions';
import { generateRandomString } from '../../../common/utils';
import { injectedWeb3 } from '../../utils/web3';
import SlotFrame from './SlotFrame';
import BetTable from './BetTable';
import Results from './Results';


@connect(
	(state, ownProps) => ({
		hashedServerSeed: state.game.hashedServerSeed,
		clientSeed: state.game.clientSeed,
	}),	{
		fetchHashedServerSeed,
		setClientSeed,
		resetBet
	}
)
export default class GameSection extends Component {
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
				<SlotFrame />

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
				<hr/>
			</div>
		);
	}
}
