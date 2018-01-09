import React, { Component } from 'react';
import { generateRandomHex, getRandom } from '../../utils/misc'


export default class ValidationSection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			clientSeed: '',
			serverSeed: '',
			
		};
	}
	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<h5>Validation</h5>

					<ul>
						<li>
							Client Seed<span>: {' '}</span>
							<input value={''}
								   onChange={()=>{}} />
						</li>
						<li>
							Server Seed<span>: {' '}</span>
							<input value={''}
								   onChange={()=>{}} />
						</li>
						<li>
							Server Seed (Hashed): {' '}
						</li>
					</ul>
				</div>
			</div>
		);
	}
}
