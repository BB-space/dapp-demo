import { browserHistory } from 'react-router';
import { request } from '../utils/fetch';
import actionTypes from '../constants/actionTypes';
import { injectedWeb3 } from '../utils/web3';
import { toWei } from '../../common/utils';


export function attemptSignIn(email, password) {
    const url = '/api/auth/login';

    return (dispatch, getState) => {
        dispatch(setAuthenticating(true));
        return request
            .post(url, { email, password })
            .then(res => {
                if(res.authorized === true) {
                    return dispatch(loginSuccess(res.user));
                }
            });
    };
}

export function attemptLogout() {
    const url = '/api/auth/logout';

    return (dispatch, getState) => {
        return request
            .get(url)
            .then(res => {
                dispatch(setAuthenticated(false));
                dispatch(setUser({
                    email: null
                }));
            });
    };
}

export function attemptSignUp(email, password) {
    const url = '/api/auth/register';

    return (dispatch, getState) => {
        return request
            .post(url, {
                email,
                password
            })
            .then(
				res => dispatch(loginSuccess(res.user)),
				reason => Promise.reject(reason)
			);
    };
}

export function checkAuth() {
    const url = '/api/auth/status';

	return (dispatch, getState) => {
        dispatch(setAuthenticating(true));
        return request
            .get(url)
            .then(res => {
                if(res.authorized === true) {
                    return dispatch(loginSuccess(res.user));
                }
            });
    };
}


function setAuthenticating(isAuthenticating) {
    return {
		type: actionTypes.AUTH_SET_AUTHENTICATING,
        isAuthenticating
	};
}

function setAuthenticated(isAuthenticated) {
    return {
		type: actionTypes.AUTH_SET_AUTHENTICATED,
        isAuthenticated
	};
}

function setUser(user) {
    return {
		type: actionTypes.AUTH_SET_USER,
        email: user.email,
		wallet: user.wallet
	};
}

function loginSuccess(user) {
    return (dispatch, getState) => {
        dispatch(setAuthenticating(false));
        dispatch(setAuthenticated(true));
        dispatch(setUser(user));

        return true;
    };
}

function setEthBalance(balance) {
	return {
		type: actionTypes.AUTH_SET_ETH_BALANCE,
		balance
	};
}

function setTokenBalance(balance) {
	return {
		type: actionTypes.AUTH_SET_TOKEN_BALANCE,
		balance
	};
}

export function setMetamaskUse(toUseMetamask) {
	return async (dispatch, getState) => {
		dispatch(setUser({ email: '', wallet: '' }));
        dispatch({
			type: actionTypes.AUTH_SET_METAMASK_USE,
			toUseMetamask
		});

		const wallet = await injectedWeb3.eth.getCoinbase();
		dispatch(setUser({ wallet }));

        return true;
    };
}

export function setMetamaskAccount(metamaskAccount) {
	return {
		type: actionTypes.AUTH_SET_METAMASK_ACCOUNT,
		metamaskAccount
	};
}

export function setMetamaskNetwork(metamaskNetwork) {
	return {
		type: actionTypes.AUTH_SET_METAMASK_NETWORK,
		metamaskNetwork
	};
}

export function setIfWeb3Injected(isInjected) {
	return {
		type: actionTypes.AUTH_SET_IF_WEB3_INJECTED,
		isInjected
	};
}

export function getAccountStatus() {
	const url = '/api/eth/balance';
	
    return async (dispatch, getState) => {
		const res = await request.get(url);

		if(res.success) {
			dispatch(setEthBalance(res.ethBalance));
		}
	};
}
