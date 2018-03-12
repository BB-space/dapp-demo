import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	setIsPlaying,
	setClientSeed,
	setServerSeed,
	setHashedServerSeed,
	setReward
} from '../../actions/resultActions';
import serviceWeb3 from  '../../utils/web3';
import { reconstructResult2, fromWei } from '../../../common/utils';
import { gameABI, gameAddress } from '../../../common/constants/contracts';
import Dice from '../common/Dice';


@connect(
	(state, ownProps) => ({
		isPlaying: state.result.isPlaying,
		clientSeed: state.result.clientSeed,
		serverSeed: state.result.serverSeed,
		hashedServerSeed: state.result.hashedServerSeed,
		reward: state.result.reward
	}),	{
		setIsPlaying,
		setClientSeed,
		setServerSeed,
		setHashedServerSeed,
		setReward		
	}
)
export default class Results extends Component {
	constructor(props) {
		super(props);
		this.state = {
			passedTime: 0,
			timer: null
		};
	}

	componentDidMount() {
		const {
			setIsPlaying,
			setClientSeed,
			setServerSeed,
			setHashedServerSeed,
			setReward
		} = this.props;
		
		const gameInstance = new serviceWeb3.eth.Contract(gameABI, gameAddress);
		
		gameInstance.events.Finalize((err, res) => {
			if(!err) {
				const {
					clientSeed,
					dealerSeed,
					hashedDealerSeed,
					reward
				} = res.returnValues;

				setIsPlaying(false);
				setClientSeed(clientSeed);
				setServerSeed(dealerSeed);
				setHashedServerSeed(hashedDealerSeed);
				setReward(fromWei(reward).toString());
			}
		});
	}
	
	componentWillReceiveProps(nextProps) {
		if(nextProps.isPlaying && !this.props.isPlaying){
			this.updatePassedTime()
		} else if(!nextProps.isPlaying && this.props.isPlaying) {
			clearInterval(this.state.timer);
			this.setState({
				passedTime: 0
			});
		}
	}

	updatePassedTime(){
		const timer = setInterval(
			() => {
				this.setState({
					passedTime: this.state.passedTime + 1
				})
			},
			1000
		);
		
		this.setState({
			timer
		});
	}

	getDiceComponent(numbers) {
		return (
			<div className="dice-box validation">
				{ numbers.map((num, idx) => (
					<Dice key={idx} face={num} />
				)) }
			</div>
		);
	}

	render() {
		const {
			isPlaying,
			clientSeed,
			serverSeed,
			hashedServerSeed,
			reward
		} = this.props;
		
		const {
			passedTime
		} = this.state;
		
		const result = reconstructResult2(serverSeed, clientSeed);

		const resultElem = (
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
			</div>
		);

		const playingElem = (
			<div>
				결과를 받는 중 입니다. 약 ({passedTime})초 경과
				<a target="_blank" href={`https://rinkeby.etherscan.io/tx/${isPlaying}`}>etherscan 에서 확인</a>
			</div>
		);

		const noPlayElem = (
			<div>
				아직 플레이하시지 않으셨습니다.
			</div>
		);

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
