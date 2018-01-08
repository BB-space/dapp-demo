import React, { Component } from 'react';


export default class GamePage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hashedSrvSeed: '',
			playerSeed: ''
		};
	}

	componentDidMount() {
		
	}

	render() {
		const {
			hashedSrvSeed
		} = this.state;
		
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<div>Game</div>
					<div><b>Hashed Server Seed</b>: { hashedSrvSeed }</div>
				</div>
			</div>
		);
	}
}
