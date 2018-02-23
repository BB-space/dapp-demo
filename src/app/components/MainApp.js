import React, { Component } from 'react';
import { connect } from 'react-redux';
import { checkAuth } from '../actions/authActions';
import Header from './common/Header';

import '../stylesheets/style.scss';
import 'font-awesome/css/font-awesome.min.css';


@connect(
	(state, ownProps) => ({

	}),	{
		checkAuth
	}
)
export default class MainApp extends Component {
	componentDidMount() {
		this.props.checkAuth();
	}
	
	render() {
        const { isAuthenticated } = this.props;

        return (
            <div className="app-container">
				<Header />
				{ this.props.children }
            </div>
        );
	}
}
