import actionTypes from '../constants/actionTypes';


const {
	GAME_SET_HASHED_SERVER_SEED,
	GAME_SET_CLIENT_SEED,
	GAME_SET_CHIP_INDEX,
	GAME_ADD_TO_BET,
	GAME_RESET_BET
} = actionTypes;

const initialState = {
	betState: {},
	currentChipIdx: 0,
	
	hashedServerSeed: '',
	clientSeed: '',
	clientSeedBytes32: ''
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

		case GAME_SET_CHIP_INDEX:
			return Object.assign({}, state, {
				currentChipIdx: action.chipIdx
			});

		case GAME_ADD_TO_BET: {
			const {
				betSide,
				addition
			} = action;

			return Object.assign({}, state, {
				betState: Object.assign(
					state.betState, {
						[betSide]: parseFloat((
							(state.betState[betSide] || 0)
							+ action.addition
						).toFixed(2))
					}
				)
			});
		}

		case GAME_RESET_BET:
			return Object.assign({}, state, {
				betState: {}
			});
			
        default:
            return state;
    }
}
