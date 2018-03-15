import React, { Component } from 'react';
import { connect } from 'react-redux';


@connect(
	(state, ownProps) => ({
		betState: state.game.betState
	}),	{
		
	}
)
export default class SlotFrame extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		window.addEventListener('OnStartGame', e => {
			console.log('set bet range');
			this.ifr.contentWindow.c2_callFunction('InitBetRange', [1000, 5000, 10000, 50000, 100000, 500000]);
		});

		window.addEventListener('OnClickBetUp', e => {
			console.log('OnClickBetUp');
			this.ifr.contentWindow.c2_callFunction('PressBetUp', []);
		});

		window.addEventListener('OnClickBetDown', e => {
			console.log('OnClickBetDown');
			this.ifr.contentWindow.c2_callFunction('PressBetDown', []);
		});

		window.addEventListener('OnClickBetMax', e => {
			console.log('OnClickBetMax');
			this.ifr.contentWindow.c2_callFunction('PressMaxBet', []);
		});

		window.addEventListener('OnClickSpin', e => {
			console.log('OnClickSpin');
			this.ifr.contentWindow.c2_callFunction('PressSpin', []);
		});

	}

	componentWillUnmount() {
		
	}

	shouldComponentUpdate() {
		return false;
	}

	componentWillReceiveProps(nextProps) {

	}

	render() {
		return (
			<div>
				<iframe
					ref={f => {this.ifr = f;}}
					src='/dist/h5slot/index.html'
					name='game'
					id='game'
					width='100%'
					height='480px'
					frameBorder='0'
					scrolling='no'>
					<p>Your browser does not support iframes</p>
				</iframe>
			</div>
		);
	}
}
