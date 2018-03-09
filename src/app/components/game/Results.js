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
		this.state = {
			passedTime:0,
			timer:null
		};
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.isPlaying && !this.props.isPlaying){
			this.updatePassedTime()
		}else if(!nextProps.isPlaying && this.props.isPlaying){
			clearInterval(this.state.timer);
			this.setState({
				passedTime:0
			});
		}
	}

	updatePassedTime(){
		const timer = setInterval(
			()=>{
				this.setState({
					passedTime: this.state.passedTime + 1
				})
			},1000
		);
		this.setState({
			timer
		})
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
		const{
			passedTime
		} = this.state;
		const result = reconstructResult2(serverSeed, clientSeed);

		const resultElem =
			<div>
				<ul>
					<li>
						축하합니다. {reward}에 당첨되셨습니다.
					</li>
					<li>
						{ this.getDiceComponent(result) }
					</li>
					<li>
						client Seed : {clientSeed} <br/>
						Server Seed : {serverSeed} <br/>
						Server Seed (Hashed): {hashedServerSeed}
					</li>
				</ul>
			</div>;

		const playingElem =
			<div>
				결과를 받는 중 입니다. 약 ({passedTime})초 경과
				<a target="_blank" href={`https://rinkeby.etherscan.io/tx/${isPlaying}`}>etherscan 에서 확인</a>
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
						<font className='heading'>게임 결과</font>
					</div>
					<br/>
					<div className="panel-body">
						{panelElem}
					</div>
				</div>
				<hr/>
			</div>
		);
	}
}
