import actionTypes from '../constants/actionTypes';


export function setCurrentAccount(newAccount) {
	return {
		type: actionTypes.ETH_SET_CURRENT_ACCOUNT,
		newAccount
	};
}
