import _ from 'lodash';
import actionTypes from '../constants/actionTypes';
import { request } from '../utils/fetch';
import { serviceWeb3 } from '../utils/web3';
import { stringToBytes32 } from '../../common/utils';
import { gameABI, gameAddress } from '../../common/constants/contracts';


function setHashedServerSeed(hashedServerSeed) {
	return {
		type: actionTypes.GAME_SET_HASHED_SERVER_SEED,
		hashedServerSeed
	};
}

export function setClientSeed(newSeed) {
	return {
		type: actionTypes.GAME_SET_CLIENT_SEED,
		newSeed,
		newSeedBytes32: stringToBytes32(newSeed)
	};
}

export function setChipIndex(chipIdx) {
	return {
		type: actionTypes.GAME_SET_CHIP_INDEX,
		chipIdx
	};
}

export function addToBet(betSide, addition) {
	return {
		type: actionTypes.GAME_ADD_TO_BET,
		betSide,
		addition
	};
}

export function resetBet() {
	return {
		type: actionTypes.GAME_RESET_BET
	};
}

export function fetchHashedServerSeed() {
	const gameMethods = new serviceWeb3.eth.Contract(gameABI, gameAddress).methods;
	
	return async (dispatch, getState) => {
		const hashListLength = await gameMethods.getHashListLength().call();
		const randIdx = _.random(hashListLength);

		const hash = await gameMethods.getHash(randIdx).call();

		new serviceWeb3.eth.Contract(gameABI, gameAddress).events.Finalize((e,r) => {
			debugger;
		})
		
		dispatch(setHashedServerSeed(hash));
	};
}

export function getGameResult() {
	const url = '/api/games';

	return (dispatch, getState) => {
		const gameObj = getState().game;

		return request.post(url, gameObj);
	};
}
