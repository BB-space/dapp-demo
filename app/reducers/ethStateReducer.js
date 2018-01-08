import actionTypes from '../constants/actionTypes';


const {
	ETH_SET_CURRENT_ACCOUNT
} = actionTypes;

const initialState = {
	currentAccount: null,
	ethBalance: 0,
	crowdsaleAddress: '0xf204a4ef082f5c04bb89f7d5e6568b796096735a',
	tokenAddress: '0x633baefc98220497eb7ee323480c87ce51a44955',
	tokenBalance: 0
};

export default function web3Reducer(state=initialState, action) {
    switch(action.type) {
		case ETH_SET_CURRENT_ACCOUNT:
			return Object.assign({}, state, {
				isChangingFilter: action.isChangingFilter
			});

        default:
            return state;
    }
}
