import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { setResultModal, setResultModalContent } from '../../actions/globalActions';
import serviceWeb3 from  '../../utils/web3';
import { reconstructResult, fromWei } from '../../../common/utils';
import { gameABI, gameAddress } from '../../../common/constants/contracts';
import ResultSymbol from './ResultSymbol';

import styles from './ResultRow.scss';


@connect(
	(state, ownProps) => ({
		results: state.results
	}),	{
		setResultModal,
		setResultModalContent
	}
)
export default class ResultRow extends Component {
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
		reward: PropTypes.string,
		timeTxMade: PropTypes.string,
		indexInResults: PropTypes.number
	};
	
	constructor(props) {
		super(props);
	}

	openModal = (evt) => {
		const {
			results,
			setResultModal,
			setResultModalContent,
			indexInResults
		} = this.props;
		
		evt.preventDefault();
		setResultModalContent(results[indexInResults]);
		setResultModal(true);
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
			timeTxMade,
			indexInResults,
			setResultModal,
			setResultModalContent,
			...restProps
		} = this.props;
		
		const waitingElem = (
			<tr className={styles.tr} {...restProps}>
				<td>
					<a onClick={this.openModal}> { initGameTxHash.substring(0, 10) + '...' } </a> <br />
				</td>
				<td>
					{ initTransacted ? '정산 대기중...' : '결과를 받는 중 입니다...' }
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
					<a onClick={this.openModal}> { initGameTxHash.substring(0, 10) + '...' } </a> <br />
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
