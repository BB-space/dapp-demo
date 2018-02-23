import React, { Component } from 'react';
import { connect } from 'react-redux';
import { attemptSignIn } from '../../actions/authActions';

import styles from './HeaderSignIn.scss';


@connect((state, ownProps) => ({

}), {
    attemptSignIn
})
export default class HeaderSignIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };

        this.handleEmailChange = this.handleFormChange.bind(this, 'email');
        this.handlePasswordChange = this.handleFormChange.bind(this, 'password');
    }

    handleFormChange(field, evt) {
        this.setState({
            [field]: evt.target.value
        });
    }

    handleSignIn = evt => {
        const {
            email,
            password
        } = this.state;

        evt.preventDefault();

        this.props.attemptSignIn(email, password);
    }

    render() {
        const {
			email,
            password
        } = this.state;

        return (
			<div className={styles.wrapper}>
				<form onSubmit={this.handleSignUp}>
					<input
					    value={email}
					    onChange={this.handleEmailChange}
					    type="email"
					    placeholder="Email"
					    required />
					<input
					    value={password}
					    onChange={this.handlePasswordChange}
					    type="password"
					    placeholder="Password"
					    required />
					<button
						onClick={this.handleSignIn}
						className="btn btn-primary">
						로그인
					</button>
				</form>
			</div>
        );
    }
}
