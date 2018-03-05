import actionTypes from '../constants/actionTypes';
import { toWei } from '../../common/utils';
import { serviceWeb3 } from '../utils/web3';
import { gameABI, gameAddress } from '../../common/constants/contracts';


export function setIsPlaying(isPlaying){
	return{
		type: actionTypes.RESULT_SET_IS_PLAYING,
		isPlaying
	}
}

export function setClientSeed(clientSeed){
	return{
		type: actionTypes.RESULT_SET_CLIENTSEED,
		clientSeed
	}
}
export function setServerSeed(serverSeed){
	return{
		type: actionTypes.RESULT_SET_SERVERSEED,
		serverSeed
	}
}
export function setHashedServerSeed(hashedServerSeed){
	return{
		type: actionTypes.RESULT_SET_HASHED_SERVER_SEED,
		hashedServerSeed
	}
}
export function setReward(reward){
	return{
		type: actionTypes.RESULT_SET_REWARD,
		reward
	}
}

export function initGame() {
	const gameMethods = new serviceWeb3.eth.Contract(gameABI, gameAddress).methods;
	return async (dispatch, getState) => {
		new serviceWeb3.eth.Contract(gameABI, gameAddress).events.Finalize((e,r) => {
			if(!e){
				dispatch(setIsPlaying(true));
			}
		})
	};
}
