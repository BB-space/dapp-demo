import React, { Component } from 'react';
import {
	keccak256,
	reconstructResult,
	stringToBytes32,
	computeMultipleHash
} from '../../../common/utils';
import Dice from '../common/Dice';


export default class ValidationSection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			clientSeed: '',
			serverSeed: '',
			hashedServerSeed: '',
			result: []
		};

		this.handleClientSeedChange = this.handleInputChange.bind(this, 'clientSeed');
		this.handleServerSeedChange = this.handleInputChange.bind(this, 'serverSeed');
	}

	getDiceComponent(numbers) {
		return (
			<div className="dice-box validation">
				{ numbers.map((num, idx) => (
					<Dice key={idx} face={num} />
				)) }
			</div>
		)
	}

	handleInputChange(whichState, evt) {
		const newVal = evt.target.value;
		this.setState({ [whichState]: newVal }, this.setNewHashAndResult);
	}

	setNewHashAndResult = () => {
		const {
			clientSeed,
			serverSeed
		} = this.state;
		this.setState({
			hashedServerSeed: computeMultipleHash(stringToBytes32(serverSeed),4),
			result: reconstructResult(serverSeed, clientSeed)
		});
	}

	render() {
		const {
			clientSeed,
			serverSeed,
			hashedServerSeed,
			result
		} = this.state;

		return (
			<div className="col-md-12">
				<div className="panel panel-default">
					<div className="panel-heading">
						<font className="heading">Validation</font>
					</div>
					<div className="panel-body">


						<ul>
							<li>
								Client Seed<span>: {' '}</span>
								<input value={clientSeed}
									   onChange={this.handleClientSeedChange} />
							</li>
							<li>
								Server Seed<span>: {' '}</span>
								<input value={serverSeed}
									   onChange={this.handleServerSeedChange} />
							</li>
							<li>
								Server Seed (Hashed): {hashedServerSeed}
							</li>
							<li>
								Result Then:
								{ this.getDiceComponent(result) }
							</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}
}
