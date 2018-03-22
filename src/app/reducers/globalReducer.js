import actionTypes from '../constants/actionTypes';


const {
	GLOBAL_SET_SIGNUP_MODAL,
	GLOBAL_SET_SETTINGS_MODAL,
	GLOBAL_SET_RESULT_MODAL,
	GLOBAL_SET_RESULT_MODAL_CONTENT,
} = actionTypes;

const initialState = {
	isSignUpModalOpen: false,
	isSettingsModalOpen: false,
	isResultModalOpen: false,
	resultModalContent: {}
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

        case GLOBAL_SET_RESULT_MODAL:
            return Object.assign({}, state, {
                isResultModalOpen: action.isOpen
            });

        case GLOBAL_SET_RESULT_MODAL_CONTENT:
            return Object.assign({}, state, {
                resultModalContent: action.resultModalContent
            });

        default:
            return state;
    }
}
