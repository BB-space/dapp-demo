import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setFinalized } from '../../actions/resultsActions';
import serviceWeb3 from  '../../utils/web3';
import { fromWei, bytesToString } from '../../../common/utils';
import { gameABI, gameAddress } from '../../../common/constants/contracts';
import ResultRow from './ResultRow';


@connect(
	(state, ownProps) => ({
		gameResults: state.results
	}),	{
		setFinalized
	}
)
export default class Results extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const {
			setFinalized
		} = this.props;
		
		const gameInstance = new serviceWeb3.eth.Contract(gameABI, gameAddress);
		
		gameInstance.events.Finalize((err, res) => {
			if(!err) {
				const { transactionHash } = res;
				const { gameResults } = this.props;
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
					setFinalized(
						hashedDealerSeed,
						true,
						bytesToString(dealerSeed),
						fromWei(reward).toString()
					);
				}
			}
		});
	}
	
	componentWillReceiveProps(nextProps) {
		if(nextProps.isPlaying && !this.props.isPlaying){
			this.updatePassedTime();
		} else if(!nextProps.isPlaying && this.props.isPlaying) {
			clearInterval(this.state.timer);
			this.setState({
				passedTime: 0
			});
		}
	}

	render() {
		const {
			gameResults
		} = this.props;

		const historyElem = gameResults.length > 0 ? (
			gameResults.map((e, idx) => <ResultRow {...e} key={idx} />)
		) : (
			<div>플레이 기록이 없습니다</div>
		);
		
		return (
			<div className="col-md-12">
				<div className="panel panel-default">
					<div className="panel-heading">
						<font className="heading">게임 결과</font>
					</div>
					<br/>
					<div className="panel-body">
						{ historyElem }
					</div>
				</div>
				<hr/>
			</div>
		);
	}
}
