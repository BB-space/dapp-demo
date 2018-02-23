import React, { Component } from 'react';
import { connect } from 'react-redux';
import { checkAuth } from '../actions/authActions';
import Header from './common/Header';
import SignUpModal from './auth/SignUpModal';

import '../stylesheets/style.scss';
import 'font-awesome/css/font-awesome.min.css';


@connect(
	(state, ownProps) => ({
		isSignUpModalOpen: state.global.isSignUpModalOpen
	}),	{
		checkAuth
	}
)
export default class MainApp extends Component {
	componentDidMount() {
		this.props.checkAuth();
	}

	render() {
        const {
			isSignUpModalOpen
		} = this.props;

        return (
            <div className="app-container">
				<Header />
				{ this.props.children }
				<SignUpModal />
            </div>
        );
	}
}
