import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import BetBoard from './BetBoard';
import Chips from './Chips';
import styles from './BetTable.scss';


@connect(
	(state, ownProps) => ({
		playerEtherBalance: state.game.playerEtherBalance
	}),	{
	}
)
export default class BetTable extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const {
			handleBetReset,
			handlePlayBtnClick,
			playerEtherBalance
		} = this.props;
		return (
			<div className = {styles.betTable}>
				<BetBoard/>
				<Chips />
				<table className = {styles.betSummary}>
					<tbody className = {styles.table}>
						<tr>
							<td className ={styles.content}>
								플레이어 잔고
							</td>
							<td>{playerEtherBalance}</td>
						</tr>
						<tr>
							<td className ={styles.content}>
								현재 배팅 금액
							</td>
							<td>하하</td>
						</tr>
						<tr>
							<td>
								<button
									onClick = {handleBetReset}
									className = {styles.button}
								>
									배팅 초기화
								</button>
							</td>
							<td>
								<button
									onClick = {handlePlayBtnClick}
									className = {styles.button}
								>
									배팅
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}
