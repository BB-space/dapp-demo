import actionTypes from '../constants/actionTypes';

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
    return async (dispatch, getState) => {
		const account = await web3.eth.getCoinbase();
		const ethBalance = await web3.eth.getBalance(account);

		if(tokenAddress) {
			dispatch(getTokenBalance(account, tokenAddress));
		}
		
		dispatch(setCurrentAccount(account));
		dispatch(setEthBalance(ethBalance));
	};
}

export function getTokenBalance(accountAddress, tokenAddress) {
    return async (dispatch, getState) => {
		const tokenInstance = new web3.eth.Contract(tokenABI, tokenAddress);
		const tokenBalance = await tokenInstance
			.methods
			.balanceOf(accountAddress)
			.call();

		dispatch(setTokenBalance(tokenBalance));
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

	tokenInstance
		.methods
		.transfer(tlpRecipient, toWei(tlpForTransfer))
		.send({ 
			from: currentAccount
		});
}
