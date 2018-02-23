import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { setMetamaskUse, attemptLogout } from '../../actions/authActions';
import { setSignUpModal } from '../../actions/globalActions';
import HeaderSignIn from '../auth/HeaderSignIn';

import styles from './HeaderRightBlock.scss';


@connect(
	(state, ownProps) => ({
		usingMetamask: state.auth.usingMetamask,
		isAuthenticated: state.auth.isAuthenticated,
		email: state.auth.email,
		wallet: state.auth.wallet
	}),	{
		attemptLogout,
		setMetamaskUse,
		setSignUpModal
	}
)
export default class HeaderRightBlock extends Component {
    constructor(props) {
        super(props);

		this.handleMetamaskClick = this.setMetamask.bind(this, true);
		this.handleMembershipClick = this.setMetamask.bind(this, false);
    }

	setMetamask(toUseMetamask, evt) {
		this.props.setMetamaskUse(toUseMetamask);
	}

	handleSignUpClick = () => {
		this.props.setSignUpModal(true);
	}

    render() {
		const {
			usingMetamask,
			isAuthenticated,
			email,
			wallet
		} = this.props;


		const caseMetamaskElem = (
			<div>
				현재 지원하지 않음
				<button
					className={classNames([
							'btn',
							'btn-secondary',
							styles.btnConversion
					])}
					onClick={this.handleMembershipClick}>
					Metamask 없이 플레이
				</button>
			</div>
		);

		const caseNotAuthedElem = (
			<div>
				<HeaderSignIn />
				<button
					className={classNames([
							'btn',
							'btn-secondary',
							styles.btnSignup
					])}
					onClick={this.handleSignUpClick}
				>
					회원가입
				</button>
				<button
					className={classNames([
							'btn',
							'btn-secondary',
							styles.btnConversion
					])}
					onClick={this.handleMetamaskClick}
				>
					Metamask로 플레이
				</button>
			</div>
		);

		const caseAuthedElem = (
			<div className={styles.wrapperAuthed}>
				<div className={styles.memberInfo}>
					<div>{email}</div>
					<div>wallet: {wallet}</div>
					
				</div>
				<button
					className={classNames([
						'btn',
						'btn-primary',
						styles.btnLogout
					])}
					onClick={this.props.attemptLogout}
				>
					로그 아웃
				</button>
			</div>
		);

		const content = usingMetamask ?
						caseMetamaskElem : isAuthenticated ?
						caseAuthedElem : caseNotAuthedElem;
		
        return(
			<div className={styles.headerRightBlock}>
				{content}
			</div>
        );
    }
}
