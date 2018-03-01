import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { setChipIndex } from '../../actions/gameActions';
import { chipUnits } from '../../constants/gameConfig';

import styles from './Chips.scss';


@connect(
	(state, ownProps) => ({
		selectedChipIdx: state.game.currentChipIdx
	}),	{
		setChipIndex
	}
)
export default class Chips extends Component {
	constructor(props) {
		super(props);
	}

	handleChipClick = (evt) => {
		this.props.setChipIndex(
			parseInt(evt.target.dataset.idx)
		);
	}

	render() {
		const {
			selectedChipIdx
		} = this.props;

		return (
			<div className={styles.chips}>
				{ chipUnits.map((chipUnit, idx) => (
					<div
						className={classNames({
								[styles.chip]: true,
								[styles.active]: idx === selectedChipIdx
						})}
						data-idx={idx}
						onClick={this.handleChipClick}
						key={chipUnit}>
						{ chipUnit }
					</div>
				)) }
			</div>
		);
	}
}
