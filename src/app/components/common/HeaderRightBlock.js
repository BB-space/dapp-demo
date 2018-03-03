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
		metamaskMode: state.auth.metamaskMode,
		isWeb3Injected: state.auth.isWeb3Injected,
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
			metamaskMode,
			isWeb3Injected,
			isAuthenticated,
			email,
			wallet
		} = this.props;


		const userInfoElem = (
			<div
				className={styles.memberInfo}
				onClick={()=>{this.props.history.push('/account');}}>
				{!metamaskMode && <div>{ email }</div>}
				<div>wallet: {wallet}</div>
			</div>
		);

		const caseMetamaskElem = (
			<div>
				{ isWeb3Injected ?
				  userInfoElem :
				  <span>'No Metamask has been detected'</span>}
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
			<div className={styles.notAuthed}>
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
			<div className={styles.wrapperAuthed}>
				
				{ userInfoElem }
				
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

		const content = metamaskMode ?
						caseMetamaskElem : isAuthenticated ?
						caseAuthedElem : caseNotAuthedElem;
		
        return(
			<div className={styles.headerRightBlock}>
				{content}
			</div>
        );
    }
}
