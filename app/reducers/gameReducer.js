import actionTypes from '../constants/actionTypes';


const {
	GAME_SET_HASHED_SERVER_SEED,
	GAME_SET_CLIENT_SEED,
	GAME_SET_BET_MONEY,
	GAME_SET_BET_SIDE
} = actionTypes;

const initialState = {
	hashedServerSeed: '',
	clientSeed: '',
	clientSeedBytes32: '',
	betSide: '0',
	betMoney: 0
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

		case GAME_SET_BET_MONEY:
			return Object.assign({}, state, {
				betMoney: action.betMoney
			});

		case GAME_SET_BET_SIDE:
			return Object.assign({}, state, {
				betSide: action.side
			});

        default:
            return state;
    }
}
