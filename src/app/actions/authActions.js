import { browserHistory } from 'react-router';
import { request } from '../utils/fetch';
import actionTypes from '../constants/actionTypes';
import { injectedWeb3, serviceWeb3, setProvider } from '../utils/web3';
import { nodeUrl } from '../../common/constants/config';
import { toWei, fromWei } from '../../common/utils';


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

export function setMetamaskUse(toUseMetamask) {
	return async (dispatch, getState) => {
		let { isWeb3Injected } = getState().auth;
		
		dispatch(setUser({ email: '', wallet: '' }));
		dispatch(setEthBalance(0));
        dispatch({
			type: actionTypes.AUTH_SET_METAMASK_USE,
			toUseMetamask
		});

		if(toUseMetamask && isWeb3Injected) {
			let wallet = injectedWeb3.eth.defaultAccount;
			
			if(!wallet) {
				web3.eth.getAccounts(async function (error, result) {
					if (error) {
						console.error(error);
					} else {
						if(result.length == 0) {
							alert('Unlock MetaMask *and* click \'Get Accounts\'');
							return false;
						} else {
							wallet = result[0]
							dispatch(setUser({ wallet }));

							const balance = await dispatch(fetchBalanceInEth(wallet));
							dispatch(setEthBalance(balance));
						}
					}
				});
			} else {
				dispatch(setUser({ wallet }));
				
				const balance = await dispatch(fetchBalanceInEth(wallet));
				dispatch(setEthBalance(balance));
			}
		}

		dispatch(fetchMetamaskNetwork());

        return true;
    };
}

function fetchMetamaskNetwork() {
	return (dispatch, getState) => {
		injectedWeb3.version.getNetwork((err, networkId) => {
			if(err) {
				console.error(err);
				return false;
			}
			
			let network = '';
			switch (networkId) {
				case '1':
					network = 'MainNet';
					break;
				case '2':
					network = 'Morden';
					break;
				case '3':
					network = 'Ropsten';
					break;
				case '4':
					network = 'Rinkeby';
					break;
				default:
					network = 'Private';
			}

			dispatch(setMetamaskNetwork(network));
		});
	};
}

function setMetamaskNetwork(metamaskNetwork) {
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

export function fetchBalanceInEth(wallet) {
	return async (dispatch, getState) => {
		try {
 			const balanceInWei = await serviceWeb3.eth.getBalance(wallet);
			const balanceInEth = parseFloat(fromWei(balanceInWei).toNumber());
			dispatch(setEthBalance(balanceInEth));
			
			return balanceInEth;
		} catch(e) {
			console.error(e);
			return null;
		}
	};
}

/* export function getAccountStatus() {
 * 	const url = '/api/eth/balance';
 * 	
 *     return async (dispatch, getState) => {
 * 		const res = await request.get(url);
 * 
 * 		if(res.success) {
 * 			dispatch(setEthBalance(res.ethBalance));
 * 		}
 * 	};
 * }*/
