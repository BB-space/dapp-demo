import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setResultModal } from '../../actions/globalActions';
import ValidationSection from '../game/ValidationSection';
import ResultSymbol from './ResultSymbol';
import Modal from '../common/Modal';

import styles from './ResultDetailModal.scss';


@connect(
	(state, ownProps) => ({
		isResultModalOpen: state.global.isResultModalOpen,
		result: state.global.resultModalContent
	}),	{
		setResultModal
	}
)
export default class SettingsModal extends Component {
    constructor(props) {
        super(props);
    }

	closeModal = () => {
		this.props.setResultModal(false);
	}

    render() {
		const {
			isResultModalOpen,
			result
		} = this.props;

        return (
			<Modal
				isOpen={isResultModalOpen}
				onClickOutside={this.closeModal}
				className={styles.modal}
			>
				<div className={styles.wrapper}>
					<div>
						<h3 className={styles.heading}>
							Game Details
						</h3>
						<table className="table">
							<tbody>
								<tr>
									<td>Transaction Hash</td>
									<td>{result.initGameTxHash}</td>
								</tr>
								<tr>
									<td>Time</td>
									<td>{result.timeTxMade}</td>
								</tr>
								<tr>
									<td>Client Seed</td>
									<td>{result.clientSeed}</td>
								</tr>
								<tr>
									<td>Server Seed</td>
									<td>{result.serverSeed}</td>
								</tr>
								<tr>
									<td>Bet Money</td>
									<td>{result.betInEth} ETH</td>
								</tr>
								<tr>
									<td>Reward</td>
									<td>{result.reward} ETH</td>
								</tr>
								<tr>
									<td>Result</td>
									<td>
										{ (result.symbolIndices || []).map((symbol, idx)=> (
											<ResultSymbol index={symbol} key={idx} />
										)) }
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<ValidationSection />
				</div>
			</Modal>
        );
    }
}
