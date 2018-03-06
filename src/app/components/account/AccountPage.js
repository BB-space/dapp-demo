import React, { Component } from 'react';
import { connect } from 'react-redux';
import Blockies from 'react-blockies';
import { getAccountStatus } from '../../actions/authActions';
import { fromWei, toWei } from '../../../common/utils';

import styles from './AccountPage.scss';


@connect(
	(state, ownProps) => ({
		metamaskMode: state.auth.metamaskMode,
		metamaskAccount: state.auth.metamaskMode,
		isAuthenticated: state.auth.isAuthenticated,
		wallet: state.auth.wallet,
		ethBalance: state.auth.ethBalance
	}),	{
		getAccountStatus
	}
)
export default class AccountPage extends Component {
	constructor(props) {
		super(props);
		
		this.refreshStatus = this.refreshStatus.bind(this);
	}

	componentDidMount(){
		// this.refreshStatus();
	}

	refreshStatus = () => {
		this.props.getAccountStatus();
	}

    render() {
		const {
			metamaskMode,
			metamaskAccount,
			isAuthenticated,
			wallet,
			ethBalance
		} = this.props;

		return (
			<main className="page-container">
				<div className="row">
					<div className="col-md-12">
						<div className="panel-heading">
							<h3>Account Info</h3>
						</div>
						
						<div className="panel-body">


							<h5>Account Address</h5>
							<div>
								<div className={styles.blockyWrapper}>
									<Blockies
								        seed={wallet} />
								</div>
								{metamaskMode ? wallet : 'Not Connected'}
							</div>
							<div className={styles.qrWrapper}>
								<img src={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${wallet}&choe=UTF-8`} />
								
							</div>
							
							
							
							<h5>Account Balance</h5>
							<div>{fromWei(ethBalance).toString() || '0.0'}</div>

							<h5>Transaction History</h5>
							<div><a target="_blank" href={`https://etherscan.io/address/${wallet}`}>ETH (https://etherscan.io)</a></div>
							
							{/* <button
								className="btn btn-default pull-right"
								onClick={this.refreshStatus}>Refresh</button> */}
						</div>
					</div>

				</div>
			</main>
		);
    }
}
