import React, { Component } from 'react';
import { connect } from 'react-redux';

import 'bootstrap-loader';
import '../stylesheets/style.scss';


export default class MainApp extends Component {
	render() {
        const { isAuthenticated } = this.props;

        return (
            <div className="container">
				{ this.props.children }
            </div>
        );
	}
}
