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

	render() {
		const {
			betState
		} = this.props;
		
		return (
			<div className={styles.wrapper}>
				<table className={styles.table}>
					<tbody>
						<tr>
							<BetCell
								colSpan="3"
							    rowSpan="2"
							    betSide="odd">
								<b>ODD</b> <br/>
								1 WINS 1 <br/>
								LOSES IF ANY TRIPPLE APPEARS
							</BetCell>
							<BetCell colSpan="6">
								
							</BetCell>
							<BetCell
								colSpan="3"
							    rowSpan="2"
							    betSide="even">
								<b>EVEN</b> <br/>
								1 WINS 1 <br/>
								LOSES IF ANY TRIPPLE APPEARS  
							</BetCell>
						</tr>
						<tr>
							<BetCell
								colSpan="3"
							    rowSpan="2"
							    betSide="triple1">
								111
							</BetCell>
							<BetCell
								colSpan="3"
								rowSpan="2"
								betSide="triple4">
								444
							</BetCell>
						</tr>
						<tr>
							<BetCell
								colSpan="3"
								rowSpan="5"
								betSide="small">
								<b>SMALL</b> <br/>
								4 TO 10 <br/>
								1 WINS 1 <br/>
								LOSES IF ANY TRIPPLE APPEARS  
							</BetCell>
							<BetCell
								colSpan="3"
								rowSpan="5"
								betSide="big">
								<b>BIG</b> <br/>
								11 TO 17 <br/>
								1 WINS 1 <br/>
								LOSES IF ANY TRIPPLE APPEARS  
							</BetCell>
						</tr>
						<tr>
							<BetCell
								colSpan="3"
								rowSpan="2"
								betSide="triple2">
								222
							</BetCell>
							<BetCell
								colSpan="3"
								rowSpan="2"
								betSide="triple5">
								555
							</BetCell>
						</tr>
						<tr>
						</tr>
						<tr>
							<BetCell
								colSpan="3"
								rowSpan="2"
								betSide="triple3">
								333
							</BetCell>
							<BetCell
								colSpan="3"
								rowSpan="2"
								betSide="triple6">
								666
							</BetCell>
						</tr>
						<tr>
						</tr>
						<tr>
							<BetCell
								colSpan="2"
								betSide="single1">
								ONE 1
							</BetCell>
							<BetCell
								colSpan="2"
								betSide="single2">
								TWO 2
							</BetCell>
							<BetCell
								colSpan="2"
								betSide="single3">
								THREE 3
							</BetCell>
							<BetCell
								colSpan="2"
								betSide="single4">
								FOUR 4
							</BetCell>
							<BetCell
								colSpan="2"
								betSide="single5">
								FIVE 5
							</BetCell>
							<BetCell
								colSpan="2"
								betSide="single6">
								SIX 6
							</BetCell>
						</tr>


					</tbody>
				</table>
			</div>
		);
	}
}
