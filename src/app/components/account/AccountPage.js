import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAccountStatus } from '../../actions/authActions';
import { fromWei, toWei } from '../../../common/utils';


@connect(
	(state, ownProps) => ({
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
		this.refreshStatus();
	}

	refreshStatus = () => {
		this.props.getAccountStatus();
	}

    render() {
		const {
			isAuthenticated,
			wallet,
			ethBalance
		} = this.props;

		return (
			<main className="page-container">
				<div className="row">
					<div className="col-md-12">
						<div className="panel panel-default">
							<div className="panel-heading">
								계좌 정보
							</div>
							<div className="panel-body">

								<ul>
									<li>내 계좌 주소: {isAuthenticated ? wallet : 'Not Connected'}</li>
									<li>ETH 잔고: {fromWei(ethBalance).toString() || '0.0'}</li>
									<button
										className="btn btn-default pull-right"
										onClick={this.refreshStatus}>Refresh</button>
								</ul>
							</div>
						</div>
					</div>


				</div>
			</main>
		);
    }
}
