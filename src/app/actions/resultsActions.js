import actionTypes from '../constants/actionTypes';


export function pushNewGame(game){
	return {
		type: actionTypes.RESULTS_PUSH_GAME,
		game
	};
}

export function changeGameState(newState){
	return {
		type: actionTypes.RESULTS_CHANGE_GAME_STATE,
		newState
	};
}

export function setInitOccurence(dealerHash, occurence, txTime){
	return {
		type: actionTypes.RESULTS_CHANGE_GAME_STATE,
		newState: {
			hashedServerSeed: dealerHash,
			initTransacted: occurence,
			timeTxMade: txTime
		}
	};
}

export function setFailure(dealerHash, hasFailed) {
	return {
		type: actionTypes.RESULTS_CHANGE_GAME_STATE,
		newState: {
			hashedServerSeed: dealerHash,
			hasFailed
		}
	};
}

export function setFinalized(
	dealerHash,
	finalized,
	symbolIndices,
	serverSeed='',
	reward='',
) {
	return {
		type: actionTypes.RESULTS_CHANGE_GAME_STATE,
		newState: {
			hashedServerSeed: dealerHash,
			finalized,
			symbolIndices,
			serverSeed,
			reward
		}
	};
}
