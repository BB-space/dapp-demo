import React, { Component } from 'react';

import styles from './BetBoard.scss';


export default class BetBoard extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={styles.wrapper}>
				<table className={styles.table}>
					<tbody>
						<tr>
							<td colSpan="3" rowSpan="2">
								<b>ODD</b> <br/>
								1 WINS 1 <br/>
								LOSES IF ANY TRIPPLE APPEARS  
							</td>
							<td colSpan="6">
								
							</td>
							<td colSpan="3" rowSpan="2">
								<b>EVEN</b> <br/>
								1 WINS 1 <br/>
								LOSES IF ANY TRIPPLE APPEARS  
							</td>
						</tr>
						<tr>
							<td colSpan="3" rowSpan="2">
								111
							</td>
							<td colSpan="3" rowSpan="2">
								444
							</td>
						</tr>
						<tr>
							<td colSpan="3" rowSpan="5">
								<b>SMALL</b> <br/>
								4 TO 10 <br/>
								1 WINS 1 <br/>
								LOSES IF ANY TRIPPLE APPEARS  
							</td>
							<td colSpan="3" rowSpan="5">
								<b>BIG</b> <br/>
								11 TO 17 <br/>
								1 WINS 1 <br/>
								LOSES IF ANY TRIPPLE APPEARS  
							</td>
						</tr>
						<tr>
							<td colSpan="3" rowSpan="2">
								222
							</td>
							<td colSpan="3" rowSpan="2">
								555
							</td>
						</tr>
						<tr>
						</tr>
						<tr>
							<td colSpan="3" rowSpan="2">
								333
							</td>
							<td colSpan="3" rowSpan="2">
								666
							</td>
						</tr>
						<tr>
						</tr>
						<tr>
							<td colSpan="2">
								ONE 1
							</td>
							<td colSpan="2">
								TWO 2
							</td>
							<td colSpan="2">
								THREE 3
							</td>
							<td colSpan="2">
								FOUR 4
							</td>
							<td colSpan="2">
								FIVE 5
							</td>
							<td colSpan="2">
								SIX 6
							</td>
						</tr>


					</tbody>
				</table>
			</div>
		);
	}
}
