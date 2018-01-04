import { combineReducers } from 'redux';
import global from './globalReducer';


const rootReducer = combineReducers({
    global
});

export default rootReducer;
