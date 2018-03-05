import actionTypes from '../constants/actionTypes';


const {
    AUTH_SET_AUTHENTICATING,
    AUTH_SET_AUTHENTICATED,
    AUTH_SET_USER,
	AUTH_SET_ETH_BALANCE,
	AUTH_SET_TOKEN_BALANCE,
	AUTH_SET_METAMASK_USE,
	AUTH_SET_IF_WEB3_INJECTED,
  AUTH_SET_METAMASK_ACCOUNT,
  AUTH_SET_METAMASK_NETWORK
} = actionTypes;

const initialState = {
	metamaskMode: false,
  metamaskAccount: '',
  metamaskNetwork: '',
	isWeb3Injected: false,
    email: '',
	wallet: '',
	ethBalance: 0,
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

		case AUTH_SET_METAMASK_USE:
			return Object.assign({}, state, {
				metamaskMode: action.toUseMetamask
			});
    case AUTH_SET_METAMASK_ACCOUNT:
      return Object.assign({}, state, {
        metamaskAccount: action.metamaskAccount
      });
    case AUTH_SET_METAMASK_NETWORK:
      return Object.assign({}, state, {
        metamaskNetwork: action.metamaskNetwork
      })

		case AUTH_SET_IF_WEB3_INJECTED:
			return Object.assign({}, state, {
				isWeb3Injected: action.isInjected
			});

        default:
            return state;
    }
}
