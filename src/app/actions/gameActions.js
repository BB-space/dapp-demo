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

export function setBetMoney(betMoney) {
	return {
		type: actionTypes.GAME_SET_BET_MONEY,
		betMoney
	};
}

export function setBetSide(side) {
	return {
		type: actionTypes.GAME_SET_BET_SIDE,
		side
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
