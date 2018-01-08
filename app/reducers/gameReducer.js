import actionTypes from '../constants/actionTypes';


const {
	GAME_SET_HASHED_SERVER_SEED,
	GAME_SET_CLIENT_SEED,
	GAME_SET_BET_MONEY
} = actionTypes;

const initialState = {
	hashedServerSeed: '',
	clientSeed: '',
	betMoney: 0
};

export default function web3Reducer(state=initialState, action) {
    switch(action.type) {
		case GAME_SET_HASHED_SERVER_SEED:
			return Object.assign({}, state, {
				hashedServerSeed: action.hashedServerSeed
			});

		case GAME_SET_CLIENT_SEED:
			return Object.assign({}, state, {
				clientSeed: action.newSeed
			});

		case GAME_SET_BET_MONEY:
			return Object.assign({}, state, {
				betMoney: action.betMoney
			});

        default:
            return state;
    }
}
