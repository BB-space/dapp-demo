import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { checkAuth } from '../actions/authActions';
import Header from './common/Header';
import MainPage from './main/MainPage';
import FaqPage from './faq/FaqPage';
import AccountPage from './account/AccountPage';
import SignUpModal from './auth/SignUpModal';

import '../stylesheets/style.scss';
import 'font-awesome/css/font-awesome.css';


@connect(
	(state, ownProps) => ({
		isSignUpModalOpen: state.global.isSignUpModalOpen
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

	render() {
        const {
			isSignUpModalOpen
		} = this.props;

        return (
            <div className="app-container">
				<Header />
				<Switch>
					<Route exact path="/"
						   component={MainPage} />
					<Route path="/faq"
						   component={FaqPage} />
					<Route path="/account"
						   component={AccountPage} />
				</Switch>
				<SignUpModal />
            </div>
        );
	}
}
