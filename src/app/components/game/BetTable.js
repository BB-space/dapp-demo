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

		return (
			<div className = {styles.betTable}>
				<BetBoard />
				<Chips />
			</div>
		);
	}
}
