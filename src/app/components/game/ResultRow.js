import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import serviceWeb3 from  '../../utils/web3';
import { reconstructResult, fromWei } from '../../../common/utils';
import { gameABI, gameAddress } from '../../../common/constants/contracts';
import Dice from '../common/Dice';



export default class Results extends Component {
	static propTypes = {
		initGameTxHash: PropTypes.string,
		hasFailed: PropTypes.bool,
		initTransacted: PropTypes.bool,
		finalized: PropTypes.bool,
		clientSeed: PropTypes.string,
		serverSeed: PropTypes.string,
		hashedServerSeed: PropTypes.string,
		symbolIndices: PropTypes.array,
		betInEth: PropTypes.string,
		reward: PropTypes.string
	};
	
	constructor(props) {
		super(props);
	}


	getDiceComponent(numbers) {
		return (
			<div className="dice-box bet-table">
				{ numbers.map((num, idx) => (
					<Dice key={idx} face={num} />
				)) }
			</div>
		);
	}

	render() {
		const {
			initGameTxHash,
			hasFailed,
			initTransacted,
			finalized,
			clientSeed,
			serverSeed,
			hashedServerSeed,
			symbolIndices,
			betInEth,
			reward,
			...restProps
		} = this.props;
		
		const waitingElem = (
			<tr {...restProps}>
				<td>
					<a target="_blank" href={`https://rinkeby.etherscan.io/tx/${initGameTxHash}`}> { initGameTxHash } </a> <br />
					
				</td>
				<td>
					{initTransacted ? '결과를 받는 중 입니다...' : '정산 대기중...' }
				</td>
				<td>
					{ betInEth } ETH
				</td>
				<td>
					-
				</td>
				<td>
					-
				</td>
			</tr>
		);

		const resultElem = (
			<tr {...restProps}>
				<td>
					<a target="_blank" href={`https://rinkeby.etherscan.io/tx/${initGameTxHash}`}> { initGameTxHash } </a> <br />
				</td>
				<td>
					Finalized
				</td>
				<td>
					{ betInEth } ETH
				</td>
				<td>
					{ (symbolIndices || []).join(',') }
				</td>
				<td>
					{ reward }
				</td>
				

			</tr>
		);


		return finalized ? resultElem : waitingElem;
	}
}
