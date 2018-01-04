import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


export default class OpponentSpace extends Component {
	static propTypes = {
		playerNum: PropTypes.number,
		isIn: PropTypes.bool,
		onSwitchClick: PropTypes.func,
		cards: PropTypes.array
	}
	
    constructor(props) {
        super(props);
    }

	render() {
		const {
			playerNum,
			onSwitchClick,
			isIn
		} = this.props;
		
		return (
			<div
				className={classNames({
						'text-center': true,
						'opponent-space': true,
						'dead': !isIn
				})}>
				<div className="text-right">
					<button
						data-playernum={playerNum}
						onClick={onSwitchClick}>
						switch
					</button>
				</div>
			</div>
		);
	}

}
