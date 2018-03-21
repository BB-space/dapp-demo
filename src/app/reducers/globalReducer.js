import actionTypes from '../constants/actionTypes';


const {
	GLOBAL_SET_SIGNUP_MODAL,
	GLOBAL_SET_SETTINGS_MODAL
} = actionTypes;

const initialState = {
	isSignUpModalOpen: false,
	isSettingsModalOpen: false
};


export default function search(state=initialState, action) {
    switch(action.type) {
        case GLOBAL_SET_SIGNUP_MODAL:
            return Object.assign({}, state, {
                isSignUpModalOpen: action.isOpen
            });

        case GLOBAL_SET_SETTINGS_MODAL:
            return Object.assign({}, state, {
                isSettingsModalOpen: action.isOpen
            });

        default:
            return state;
    }
}
