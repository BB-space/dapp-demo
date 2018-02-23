import actionTypes from '../constants/actionTypes';


export function setSignUpModal(isOpen) {
	return {
		type: actionTypes.GLOBAL_SET_SIGNUP_MODAL,
		isOpen
	};
}
