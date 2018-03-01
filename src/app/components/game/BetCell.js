import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { addToBet } from '../../actions/gameActions';
import { chipUnits } from '../../constants/gameConfig';

import styles from './BetCell.scss';


@connect(
	(state, ownProps) => ({
		betState: state.game.betState,
		currentChipIdx: state.game.currentChipIdx
	}),	{
		addToBet
	},
	null,
	{ pure: false }
)
export default class BetBoard extends Component {
	static propTypes = {
		betSide: PropTypes.string
	};
	
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
			betSide,
			children,
			betState,
			currentChipIdx,
			addToBet,
			...restProps
		} = this.props;
		
		const {
			className
		} = restProps;

		const betMoney = betState[betSide];

		const currentBetElem = (betMoney > 0) && (
			<div className={styles.currentBet}>
				{ betMoney }
			</div>
		)
		
		return (
			<td
		        {...restProps}
			    data-betside={betSide}
			    onClick={this.handleBetClick}
				className={classNames([
						styles.cell,
						className,
						{ [styles.active]: (betMoney || 0) > 0 }
				])}
			>
				{ children }

				{ currentBetElem }
			</td>
		);
	}
}
