import React, { Component } from 'react';
import { connect } from 'react-redux';
import { checkAuth } from '../actions/authActions';

import 'bootstrap-loader';
import '../stylesheets/style.scss';


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
            <div className="container">
				{ this.props.children }
            </div>
        );
	}
}
