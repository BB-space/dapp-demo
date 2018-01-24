import actionTypes from '../constants/actionTypes';


const {
    AUTH_SET_AUTHENTICATING,
    AUTH_SET_AUTHENTICATED,
    AUTH_SET_USER,
	AUTH_SET_ETH_BALANCE,
	AUTH_SET_TOKEN_BALANCE
} = actionTypes;

const initialState = {
    email: '',
	wallet: '',
	ethBalance: 0,
	tokenBalance: 0,
    isAuthenticating: false,
    isAuthenticated: false
};

export default function search(state=initialState, action) {
    switch(action.type) {
        case AUTH_SET_AUTHENTICATING:
            return Object.assign({}, state, {
                isAuthenticating: action.isAuthenticating
            });

        case AUTH_SET_AUTHENTICATED:
            return Object.assign({}, state, {
                isAuthenticated: action.isAuthenticated
            });

        case AUTH_SET_USER:
            return Object.assign({}, state, {
                email: action.email,
				wallet: action.wallet
            });

		case AUTH_SET_ETH_BALANCE:
			return Object.assign({}, state, {
				ethBalance: action.balance
			});

		case AUTH_SET_TOKEN_BALANCE:
			return Object.assign({}, state, {
				tokenBalance: action.balance
			});

        default:
            return state;
    }
}
