import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	reconstructResult2,
} from '../../../common/utils';

@connect(
	(state, ownProps) => ({
		isPlaying: state.result.isPlaying,
		clientSeed: state.result.clientSeed,
		serverSeed: state.result.serverSeed,
		hashedServerSeed: state.result.hashedServerSeed,
		reward: state.result.reward
	}),	{
	}
)
export default class Results extends Component {
	constructor(props) {
		super(props);
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
			<div className="dice-box validation">
				{ numbers.map(e => dices[e-1]) }
			</div>
		)
	}

	render() {
		const {
			isPlaying,
			clientSeed,
			serverSeed,
			hashedServerSeed,
			reward
		} = this.props;

		const result = reconstructResult2(serverSeed, clientSeed);

		const resultElem =
			<div>
				축하합니다. {reward}에 당첨되셨습니다.
				<ul>
					<li>
						client Seed : {clientSeed} <br/>
						Server Seed : {serverSeed} <br/>
						Server Seed (Hashed): {hashedServerSeed}
					</li>
					<li>
						Result Then:
						{ this.getDiceComponent(result) }
					</li>
				</ul>
			</div>;

		const playingElem =
			<div>
				결과를 받는 중 입니다.
			</div>;

		const noPlayElem =
			<div>
				아직 플레이하시지 않으셨습니다.
			</div>;

		const panelElem =
			isPlaying?playingElem:
			clientSeed ===''?noPlayElem:
			resultElem;

		return (
			<div className="col-md-12">
				<div className="panel panel-default">
					<div className="panel-heading">
						게임 결과
					</div>
					<div className="panel-body">
						{panelElem}
					</div>
				</div>
			</div>
		);
	}
}
