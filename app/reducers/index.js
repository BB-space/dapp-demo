import { combineReducers } from 'redux';
import ethState from './ethStateReducer';


const rootReducer = combineReducers({
    ethState
});

export default rootReducer;
