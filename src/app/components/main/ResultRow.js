import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import serviceWeb3 from  '../../utils/web3';
import { reconstructResult, fromWei } from '../../../common/utils';
import { gameABI, gameAddress } from '../../../common/constants/contracts';
import ResultSymbol from './ResultSymbol';

import styles from './ResultRow.scss';


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
			<tr className={styles.tr} {...restProps}>
				<td>
					<a target="_blank" href={`https://rinkeby.etherscan.io/tx/${initGameTxHash}`}> { initGameTxHash } </a> <br />
					
				</td>
				<td>
					{initTransacted ? '정산 대기중...' : '결과를 받는 중 입니다...' }
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
			<tr className={styles.tr} {...restProps}>
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
					{ (symbolIndices || []).map((symbol, idx)=> (
						<ResultSymbol index={symbol} key={idx} />
					)) }
				</td>
				<td>
					<span className={classNames({
							[styles.positive]: (reward - betInEth) > 0,
							[styles.negative]: (reward - betInEth) < 0
					})}>
						{ (reward - betInEth) } ETH
					</span>
				</td>
			</tr>
		);


		return finalized ? resultElem : waitingElem;
	}
}
