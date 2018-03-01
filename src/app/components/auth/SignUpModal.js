import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setSignUpModal } from '../../actions/globalActions';
import Modal from '../common/Modal';
import SignUp from './SignUp';

import styles from './SignUpModal.scss';


@connect(
	(state, ownProps) => ({
		isSignUpModalOpen: state.global.isSignUpModalOpen
	}),	{
		setSignUpModal
	}
)
export default class SignUpModal extends Component {
    constructor(props) {
        super(props);
    }

	closeSignUpModal = () => {
		this.props.setSignUpModal(false);
	}
	
    render() {
		const {
			isSignUpModalOpen
		} = this.props;
		
        return (
			<Modal isOpen={isSignUpModalOpen}
				   onClickOutside={this.closeSignUpModal}>
				<div className="panel panel-default">

					<div className="panel-body">
						<SignUp />
					</div>
				</div>
			</Modal>
        );
    }
}
