import React, { Component } from 'react';
import classNames from 'classnames';
import BetBoard from './BetBoard';
import Chips from './Chips';
import styles from './BetTable.scss';

export default class BetTable extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const {
			handleBetReset,
			handlePlayBtnClick,
		} = this.props;
		return (
			<div className = {styles.betTable}>
				<BetBoard/>
				<Chips />
				<button onClick = {handlePlayBtnClick}>
					play
				</button>
				<button onClick = {handleBetReset}>
					reset
				</button>
			</div>
		);
	}
}
