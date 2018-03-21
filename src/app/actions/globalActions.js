import actionTypes from '../constants/actionTypes';


export function setSignUpModal(isOpen) {
	return {
		type: actionTypes.GLOBAL_SET_SIGNUP_MODAL,
		isOpen
	};
}

export function setSettingsModal(isOpen) {
	return {
		type: actionTypes.GLOBAL_SET_SETTINGS_MODAL,
		isOpen
	};
}
