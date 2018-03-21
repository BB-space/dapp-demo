import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setClientSeed, fetchHashedServerSeed } from '../../actions/gameActions';
import { setSettingsModal } from '../../actions/globalActions';
import Modal from '../common/Modal';

import styles from './SettingsModal.scss';


@connect(
	(state, ownProps) => ({
		hashedServerSeed: state.game.hashedServerSeed,
		clientSeed: state.game.clientSeed,
		isSettingsModalOpen: state.global.isSettingsModalOpen
	}),	{
		setClientSeed,
		fetchHashedServerSeed,
		setSettingsModal
	}
)
export default class SettingsModal extends Component {
    constructor(props) {
        super(props);
    }

	closeModal = () => {
		this.props.setSettingsModal(false);
	}

	handleClientSeedChange = (evt) => {
		const newVal = evt.target.value;
		this.props.setClientSeed(newVal);
	}
	
    render() {
		const {
			hashedServerSeed,
			clientSeed,
			isSettingsModalOpen,
			fetchHashedServerSeed
		} = this.props;

        return (
			<Modal
				isOpen={isSettingsModalOpen}
				onClickOutside={this.closeModal}
				className={styles.modal}
			>
				<div className={styles.wrapper}>
					<h4 className={styles.heading}>
						배팅 변경
					</h4>
					
					<ul>
						<li>
							<b>Hashed Server Seed</b>
							<span>: { hashedServerSeed } </span>
							<button onClick={fetchHashedServerSeed}>다른 해시 불러오기</button>
						</li>
						<li>
							<b>Client Seed</b><span>: {' '}</span>
							<input
							value={clientSeed}
							onChange={this.handleClientSeedChange} />
						</li>
					</ul>
				</div>
			</Modal>
        );
    }
}
