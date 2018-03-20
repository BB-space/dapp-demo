import React, { Component } from 'react';
import classNames from 'classnames';
import web3 from '../../utils/web3';
import {
	gameAddress,
	gameABI
} from '../../../common/constants/contracts';
import GameSection from '../game/GameSection';
import ValidationSection from '../game/ValidationSection';



export default class MainPage extends Component {
	constructor(props) {
		super(props);
	}

	handleInputChange(whichState, evt) {
		const newVal = evt.target.value;

		this.setState({ [whichState]: newVal });
	}


    render() {
		return (
			<main className="page-container">
				<div className="row">
					<GameSection />
					<ValidationSection />
				</div>
			</main>
		);
    }
}
