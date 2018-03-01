import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Chips.scss';


export default class Chips extends Component {
	static propTypes = {
		chipUnits: PropTypes.array,
		onChipClick: PropTypes.func,
		selectedChipIdx: PropTypes.number
	};
	
	constructor(props) {
		super(props);
	}

	render() {
		const {
			chipUnits,
			onChipClick,
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
						onClick={onChipClick}
						key={chipUnit}>
						{ chipUnit }
					</div>
				)) }
			</div>
		);
	}
}
