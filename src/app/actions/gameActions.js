import actionTypes from '../constants/actionTypes';
import { request } from '../utils/fetch';
import { stringToBytes32 } from '../../common/utils';


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
	const url = '/api/games/seedhash'
	
	return async (dispatch, getState) => {
		const res = await request.get(url);
		dispatch(setHashedServerSeed(res.hashed_seed));
	};
}

export function getGameResult() {
	const url = '/api/games';

	return (dispatch, getState) => {
		const gameObj = getState().game;

		return request.post(url, gameObj);
	};
}
