import { combineReducers } from 'redux';
import global from './globalReducer';
import auth from './authReducer';
import game from './gameReducer';
import result from './resultReducer';


const rootReducer = combineReducers({
	global,
	auth,
	game,
	result
});

export default rootReducer;
