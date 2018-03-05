import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { addToBet } from '../../actions/gameActions';
import { chipUnits } from '../../constants/gameConfig';
import BetCell from './BetCell';

import styles from './BetBoard.scss';


@connect(
	(state, ownProps) => ({
		betState: state.game.betState,
		currentChipIdx: state.game.currentChipIdx
	}),	{
		addToBet
	}
)
export default class BetBoard extends Component {
	constructor(props) {
		super(props);
	}

	handleBetClick = (evt) => {
		const betSide = evt.target.dataset.betside;

		if(betSide) {
			const {
				addToBet,
				currentChipIdx
			} = this.props;

			addToBet(
				betSide,
				parseFloat(chipUnits[currentChipIdx])
			);
		}
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
			<div className="bet-table dice-box">
				{ numbers.map(e => dices[e-1]) }
			</div>
		)
	}

	render() {
		const {
			betState,
		} = this.props;

		return (
			<div className={styles.wrapper}>
				<table className={styles.table}>
					<tbody>
						<tr>
							<BetCell
								colSpan="3"
							    rowSpan="4"
							    betSide="odd">
								<b>ODD</b> <br/>
								주사위 합이 홀수일 시 <br/>
								2배 지급
							</BetCell>
							<BetCell colSpan="6" rowSpan="2">
								<b>TRIPPLE</b> <br/>
								모든 주사위 면이 같을 시 216배 지급
							</BetCell>
							<BetCell
								colSpan="3"
							    rowSpan="4"
							    betSide="even">
								<b>ODD</b> <br/>
								주사위 합이 짝수일 시 <br/>
								2배 지급
							</BetCell>
						</tr>
						<tr/>
						<tr>
							<BetCell
								colSpan="3"
							    rowSpan="2"
							    betSide="triple1">
								{this.getDiceComponent([1,1,1])}
							</BetCell>
							<BetCell
								colSpan="3"
								rowSpan="2"
								betSide="triple4">
								{this.getDiceComponent([4,4,4])}
							</BetCell>
						</tr>
						<tr/>
						<tr>
							<BetCell
								colSpan="3"
								rowSpan="4"
								betSide="small">
								<b>SMALL</b> <br/>
								주사위 합이 10이하 일 시 <br/>
								2배 지급
							</BetCell>
							<BetCell
								colSpan="3"
								rowSpan="2"
								betSide="triple2">
								{this.getDiceComponent([2,2,2])}
							</BetCell>
							<BetCell
								colSpan="3"
								rowSpan="2"
								betSide="triple5">
								{this.getDiceComponent([5,5,5])}
							</BetCell>
							<BetCell
								colSpan="3"
								rowSpan="4"
								betSide="big">
								<b>BIG</b> <br/>
								주사위 합이 11이상 일 시 <br/>
								2배 지급
							</BetCell>
						</tr>
						<tr>
						</tr>
						<tr>
							<BetCell
								colSpan="3"
								rowSpan="2"
								betSide="triple3">
								{this.getDiceComponent([3,3,3])}
							</BetCell>
							<BetCell
								colSpan="3"
								rowSpan="2"
								betSide="triple6">
								{this.getDiceComponent([6,6,6])}
							</BetCell>
						</tr>
						<tr/>
						<tr>
							<BetCell colSpan="12" rowSpan="2">
								<b>SINGLE</b> <br/>
								선택한 숫자가 하나라도 나오면 2.37배 지급
							</BetCell>
						</tr>
						<tr/>
						<tr>
							<BetCell
								colSpan="2"
								betSide="single1">
								{this.getDiceComponent([1])}
							</BetCell>
							<BetCell
								colSpan="2"
								betSide="single2">
								{this.getDiceComponent([2])}
							</BetCell>
							<BetCell
								colSpan="2"
								betSide="single3">
								{this.getDiceComponent([3])}
							</BetCell>
							<BetCell
								colSpan="2"
								betSide="single4">
								{this.getDiceComponent([4])}
							</BetCell>
							<BetCell
								colSpan="2"
								betSide="single5">
								{this.getDiceComponent([5])}
							</BetCell>
							<BetCell
								colSpan="2"
								betSide="single6">
								{this.getDiceComponent([6])}
							</BetCell>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}
