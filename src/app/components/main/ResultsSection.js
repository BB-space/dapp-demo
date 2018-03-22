import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResultRow from './ResultRow';


@connect(
	(state, ownProps) => ({
		gameResults: state.results
	}),	{
	}
)
export default class Results extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			gameResults
		} = this.props;

		const historyElem = gameResults.length > 0 ? (
			<table className="table">
				<thead>
					<tr>
						<td>Transaction</td>
						<td>Status</td>
						<td>Bet Amount</td>
						<td>Result</td>
						<td>Profit</td>
					</tr>
				</thead>
				<tbody>
					{ gameResults.map((e, idx) => (
						<ResultRow
							{...e}
						    key={idx}
						    indexInResults={idx}
						/>
					)) }
				</tbody>
			</table>				
			
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

					{ historyElem }
				</div>
				<hr/>
			</div>
		);
	}
}
