import actionTypes from '../constants/actionTypes';


const {
	GAME_SET_HASHED_SERVER_SEED,
	GAME_SET_CLIENT_SEED,
	GAME_SET_BET_INDEX
} = actionTypes;

const initialState = {
	betIdx: 0,
	hashedServerSeed: '',
	clientSeed: '',
	clientSeedBytnes32: ''
};

export default function gameReducer(state=initialState, action) {
    switch(action.type) {
		case GAME_SET_HASHED_SERVER_SEED:
			return Object.assign({}, state, {
				hashedServerSeed: action.hashedServerSeed
			});

		case GAME_SET_CLIENT_SEED:
			return Object.assign({}, state, {
				clientSeed: action.newSeed,
				clientSeedBytes32: action.newSeedBytes32
			});

		case GAME_SET_BET_INDEX:
			return Object.assign({}, state, {
				betIdx: action.betIdx
			});

        default:
            return state;
    }

}
