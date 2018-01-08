import { combineReducers } from 'redux';
import ethState from './ethStateReducer';
import game from './gameReducer';


const rootReducer = combineReducers({
    ethState,
	game
});

export default rootReducer;
