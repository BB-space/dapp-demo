import React, { Component } from 'react';
import { connect } from 'react-redux';
import Web3 from 'web3';
import {
	fetchHashedServerSeed,
	setClientSeed,
} from '../../actions/gameActions';
import { setSettingsModal } from '../../actions/globalActions';
import { generateRandomString } from '../../../common/utils';
import SlotFrame from './SlotFrame';


@connect(
	(state, ownProps) => ({

	}),	{
		fetchHashedServerSeed,
		setClientSeed,
		setSettingsModal
	}
)
export default class GameSection extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.fetchHashedServerSeed();
		this.props.setClientSeed(generateRandomString());
	}

	handleSettingsBtnClick = (evt) => {
		this.props.setSettingsModal(true);
	}

	render() {
		return (
			<div className="col-md-12">
				<button
					className="btn btn-primary pull-right"
					onClick={this.handleSettingsBtnClick}>
					<i className="fa fa-cog" />
					{' '}Settings
				</button>
				
				<SlotFrame />
			</div>
		);
	}
}
