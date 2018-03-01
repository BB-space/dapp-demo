import React, { Component } from 'react';
import { connect } from 'react-redux';
import { attemptSignUp } from '../../actions/authActions';


@connect((state, ownProps) => ({

}), {
    attemptSignUp
})
export default class SignUp extends Component {
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

    handleSignUp = evt => {
        const {
            email,
            password
        } = this.state;

        evt.preventDefault();

        this.props.attemptSignUp(email, password);
    }

    render() {
        const {
			email,
            password
        } = this.state;

        return (
			<form onSubmit={this.handleSignUp}>
				<div>
					<input
						value={email}
						onChange={this.handleEmailChange}
						type="email"
						placeholder="Email"
						required />
				</div>
				<div>
					<input
						value={password}
						onChange={this.handlePasswordChange}
						type="password"
						placeholder="password"
						required />
				</div>
				<div>
					<button type="submit"
						className="btn btn-primary">
						회원 가입
					</button>
				</div>
			</form>
        );
    }
}
