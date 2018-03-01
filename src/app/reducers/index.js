import { combineReducers } from 'redux';
import ethState from './ethStateReducer';
import global from './globalReducer';
import auth from './authReducer';
import game from './gameReducer';


const rootReducer = combineReducers({
	global,
    ethState,
	auth,
	game
});

export default rootReducer;
