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

export function setResultModal(isOpen) {
	return {
		type: actionTypes.GLOBAL_SET_RESULT_MODAL,
		isOpen
	};
}

export function setResultModalContent(content) {
	return {
		type: actionTypes.GLOBAL_SET_RESULT_MODAL_CONTENT,
		resultModalContent: content
	};
}
