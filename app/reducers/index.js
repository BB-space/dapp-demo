import { combineReducers } from 'redux';
import ethState from './ethStateReducer';
import auth from './authReducer';
import game from './gameReducer';


const rootReducer = combineReducers({
    ethState,
	auth,
	game
});

export default rootReducer;
