import actionTypes from '../constants/actionTypes';


const {
	GLOBAL_SET_SIGNUP_MODAL
} = actionTypes;

const initialState = {
	isSignUpModalOpen: false
};


export default function search(state=initialState, action) {
    switch(action.type) {
        case GLOBAL_SET_SIGNUP_MODAL:
            return Object.assign({}, state, {
                isSignUpModalOpen: action.isOpen
            });

        default:
            return state;
    }
}
