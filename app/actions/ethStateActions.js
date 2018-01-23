import actionTypes from '../constants/actionTypes';
import { request } from '../utils/fetch';

import { abi as tokenABI } from '../../build/contracts/Tulip.json';


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

function setTokenBalance(balance) {
	return {
		type: actionTypes.ETH_SET_TOKEN_BALANCE,
		balance
	};
}

export function getAccountStatus(tokenAddress='') {
	const url = '/api/eth/balance';
	
    return async (dispatch, getState) => {
		const account = getState().auth.wallet;
		const res = await request.get(url);
		dispatch(setEthBalance(res.ethBalance));
		dispatch(setTokenBalance(res.tokenBalance));
	};
}

export function buyTokens(amtEth) {
	const url = '/api/eth/tokenpurchase';

	return (dispatch, getState) => {
		const account = getState().auth.wallet;
		
		return request.post(url, {
			amtWei: web3.utils.toWei(String(amtEth))
		});
	};
}

export function sendToken() {
	const {
		currentAccount,
		tokenAddress,
		tlpForTransfer,
		tlpRecipient
	} = this.state;

	const tokenInstance = new web3.eth.Contract(tulipABI, tokenAddress);

	return tokenInstance
		.methods
		.transfer(tlpRecipient, toWei(tlpForTransfer))
		.send({ 
			from: currentAccount
		});
}
