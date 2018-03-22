import actionTypes from '../constants/actionTypes';


const {
	RESULTS_PUSH_GAME,
	RESULTS_CHANGE_GAME_STATE
} = actionTypes;


/*
state: array of game objects

Game Object: {
   initGameTxHash,
   finalizeTxHash,
   hasFailed,
   initTransacted,
   finalized,
   clientSeed,
   serverSeed,
   hashedServerSeed,
   betInEth,
   reward,
   symbolIndices,
   timeTxMade
}
*/
const initialState = [];


export default function results(state=initialState, action) {
	switch(action.type) {
		case RESULTS_PUSH_GAME:
			return [action.game, ...state];
			
		case RESULTS_CHANGE_GAME_STATE: {
			const newResults = [...state];

			let game = newResults
				.find(record => (
					record.hashedServerSeed
					=== action.newState.hashedServerSeed
				));

			if(game) {
				game = Object.assign(game, action.newState);
			}

			return newResults;
		}
			
		default:
			return state;
	}
}
