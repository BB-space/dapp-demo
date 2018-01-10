import actionTypes from '../constants/actionTypes';


const {
	ETH_SET_CURRENT_ACCOUNT,
	ETH_SET_ETH_BALANCE,
	ETH_SET_TOKEN_BALANCE
} = actionTypes;

const initialState = {
	currentAccount: null,
	ethBalance: 0,
	tokenBalance: 0
};

export default function ethState(state=initialState, action) {
    switch(action.type) {
		case ETH_SET_CURRENT_ACCOUNT:
			return Object.assign({}, state, {
				currentAccount: action.newAccount
			});

		case ETH_SET_ETH_BALANCE:
			return Object.assign({}, state, {
				ethBalance: action.balance
			});

		case ETH_SET_TOKEN_BALANCE:
			return Object.assign({}, state, {
				tokenBalance: action.balance
			});

        default:
            return state;
    }
}
