import React, { Component } from 'react';
import {
	keccak256,
	reconstructResult,
	stringToBytes32
} from '../../../common/utils';


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
		const dices = [
			(
				<div className="first-face">
					<span className="pip" />
				</div>
			), (
				<div className="second-face">
					<span className="pip" />
					<span className="pip" />
				</div>
			), (
				<div className="third-face">
					<span className="pip" />
					<span className="pip" />
					<span className="pip" />
				</div>
			), (
				<div className="fourth-face">
					<div className="column">
						<span className="pip" />
						<span className="pip" />
					</div>
					<div className="column">
						<span className="pip" />
						<span className="pip" />
					</div>
				</div>
			), (
				<div className="fifth-face">
					<div className="column">
						<span className="pip" />
						<span className="pip" />
					</div>
					<div className="column">
						<span className="pip" />
					</div>
					<div className="column">
						<span className="pip" />
						<span className="pip" />
					</div>
				</div>
			), (
				<div className="sixth-face">
					<div className="column">
						<span className="pip" />
						<span className="pip" />
						<span className="pip" />
					</div>
					<div className="column">
						<span className="pip" />
						<span className="pip" />
						<span className="pip" />
					</div>
				</div>
			)
		];

		return (
			<div className="dice-box validation">
				{ numbers.map(e => dices[e-1]) }
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
			hashedServerSeed: keccak256(stringToBytes32(serverSeed)),
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
						Validation
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
