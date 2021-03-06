import React, { Component } from 'react';
import {
	keccak256,
	reconstructResult,
	stringToBytes32,
	computeMultipleHash
} from '../../../common/utils';
import ResultSymbol from '../main/ResultSymbol';


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
			<div>
				<h3>Validation</h3>

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
						<div>
							{ (result || []).map((symbol, idx)=> (
								<ResultSymbol index={symbol} key={idx} />
							)) }
						</div>
					</li>
				</ul>
			</div>
		);
	}
}
