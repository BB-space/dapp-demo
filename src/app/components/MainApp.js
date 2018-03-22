import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { checkAuth } from '../actions/authActions';
import Header from './common/Header';
import MainPage from './main/MainPage';
import FaqPage from './faq/FaqPage';
import AccountPage from './account/AccountPage';
import SettingsModal from './main/SettingsModal';
import ResultDetailModal from './main/ResultDetailModal';
// import SignUpModal from './auth/SignUpModal';

import '../stylesheets/style.scss';
import 'font-awesome/css/font-awesome.css';


@connect(
	(state, ownProps) => ({
		isSignUpModalOpen: state.global.isSignUpModalOpen,
		isSettingsModalOpen: state.global.isSettingsModalOpen,
		isResultModalOpen: state.global.isResultModalOpen,
	}),	{
		checkAuth
	},
	null,
	{ pure: false }
)
export default class MainApp extends Component {
	componentDidMount() {
		// this.props.checkAuth();
	}

	isModalOpen = () => {
		const {
			isSignUpModalOpen,
			isSettingsModalOpen,
			isResultModalOpen
		} = this.props;
		
		return isSignUpModalOpen
			|| isSettingsModalOpen
			|| isResultModalOpen;
	}

	render() {

        return (
            <div className={classNames({
					"app-container": true,
					"modal-open": this.isModalOpen()
			})}>
				<Header />
				<Switch>
					<Route exact path="/"
						   component={MainPage} />
					<Route path="/faq"
						   component={FaqPage} />
					<Route path="/account"
						   component={AccountPage} />
				</Switch>
				
				<SettingsModal />
				<ResultDetailModal />
				{/* <SignUpModal /> */}
            </div>
        );
	}
}
