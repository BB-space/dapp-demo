import { combineReducers } from 'redux';
import global from './globalReducer';
import auth from './authReducer';
import game from './gameReducer';
import results from './resultsReducer';


const rootReducer = combineReducers({
	global,
	auth,
	game,
	results
});

export default rootReducer;
