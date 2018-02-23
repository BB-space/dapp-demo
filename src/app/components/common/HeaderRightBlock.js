import React, { Component } from 'react';
import { connect } from 'react-redux';
import HeaderSignIn from '../auth/HeaderSignIn';

import styles from './HeaderRightBlock.scss';


@connect(
	(state, ownProps) => ({
		isAuthenticated: state.auth.isAuthenticated,
		wallet: state.auth.wallet
	}),	{
		
	}
)
export default class HeaderRightBlock extends Component {
    constructor(props) {
        super(props);
    }

    render() {
		const {
			isAuthenticated,
			wallet
		} = this.props;
		
        return(
			<div className={styles.headerRightBlock}>
				{!isAuthenticated && <HeaderSignIn />}
			</div>
        );
    }
}
