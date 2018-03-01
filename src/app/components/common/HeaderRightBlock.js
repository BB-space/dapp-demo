import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
@withRouter
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
							'btn-primary',
							styles.btnConversion
					])}
					onClick={this.handleMembershipClick}>
					Play without Metamask
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
					Sign Up
				</button>
				<button
					className={classNames([
							'btn',
							'btn-secondary',
							styles.btnConversion
					])}
					onClick={this.handleMetamaskClick}
				>
					Use Metamask
				</button>
			</div>
		);

		const caseAuthedElem = (
			<div
				onClick={()=>{this.props.history.push('/account');}}
				className={styles.wrapperAuthed}>
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
					Sign Out
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
