import actionTypes from '../constants/actionTypes';
import { request } from '../utils/fetch';
import { toWei } from '../../common/utils';



function setCurrentAccount(newAccount) {
	return {
		type: actionTypes.ETH_SET_CURRENT_ACCOUNT,
		newAccount
	};
}

function setEthBalance(balance) {
	return {
		type: actionTypes.ETH_SET_ETH_BALANCE,
		balance
	};
}

export function getAccountStatus() {
	const url = '/api/eth/balance';
	
    return async (dispatch, getState) => {
		const account = getState().auth.wallet;
		const res = await request.get(url);

		if(res.success) {
			dispatch(setEthBalance(res.ethBalance));
		}
	};
}
