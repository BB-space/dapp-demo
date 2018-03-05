import actionTypes from '../constants/actionTypes';


const {
	RESULT_SET_IS_PLAYING,
	RESULT_SET_CLIENTSEED,
	RESULT_SET_SERVERSEED,
	RESULT_SET_HASHED_SERVER_SEED,
	RESULT_SET_REWARD
} = actionTypes;

const initialState = {
	isPlaying:false,
	clientSeed:'',
	serverSeed:'',
	hashedServerSeed:'',
	reward:''
};

export default function ethState(state=initialState, action) {
  switch(action.type) {
		case RESULT_SET_IS_PLAYING:
			return Object.assign({}, state, {
				isPlaying: action.isPlaying
			});
		case RESULT_SET_CLIENTSEED:
			return Object.assign({}, state, {
				clientSeed: action.clientSeed
			});
		case RESULT_SET_SERVERSEED:
			return Object.assign({}, state, {
				serverSeed: action.serverSeed
			});
		case RESULT_SET_HASHED_SERVER_SEED:
			return Object.assign({}, state, {
				hashedServerSeed: action.hashedServerSeed
			});
		case RESULT_SET_REWARD:
			return Object.assign({}, state, {
				reward: action.reward
			});
		default:
			return state;
	}
}
