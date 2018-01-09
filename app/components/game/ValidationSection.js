import React, { Component } from 'react';
import { keccak256, getRandom } from '../../utils/misc'


export default class ValidationSection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			clientSeed: '',
			serverSeed: '',
			hashedServerSeed: '',
			result: ''
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
			hashedServerSeed: keccak256(serverSeed),
			result: getRandom(serverSeed, clientSeed)
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
			<div className="panel panel-default">
				<div className="panel-body">
					<h5>Validation</h5>

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
							Result Then: {result}
						</li>
					</ul>
				</div>
			</div>
		);
	}
}
