import actionTypes from '../constants/actionTypes';
import { request } from '../utils/fetch';


function setHashedServerSeed(hashedServerSeed) {
	return {
		type: actionTypes.GAME_SET_HASHED_SERVER_SEED,
		hashedServerSeed
	};
}

export function setClientSeed(newSeed) {
	return {
		type: actionTypes.GAME_SET_CLIENT_SEED,
		newSeed
	};
}

export function setBetMoney(betMoney) {
	return {
		type: actionTypes.GAME_SET_BET_MONEY,
		betMoney
	};
}

export function fetchHashedServerSeed() {
	const url = '/api/seedhash'
	
	return async (dispatch, getState) => {
		const res = await request.get(url);
		dispatch(setHashedServerSeed(res.hashed_seed));
	};
}

export function getGameResult() {
	const url = '/api/game';

	return async (dispatch, getState) => {
		
		const {
			hashedServerSeed,
			clientSeed
		} = getState().game;
		
		const res = await request.post(url, {
			hashedServerSeed,
			clientSeed
		});
		console.log(res.serverSeed);
	};
}
