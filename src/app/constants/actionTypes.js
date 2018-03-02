import keymirror from 'keymirror';

export default keymirror({
	// global
	GLOBAL_SET_SIGNUP_MODAL: null,
	
	// eth state
	ETH_SET_CURRENT_ACCOUNT: null,
	ETH_SET_ETH_BALANCE: null,
	ETH_SET_TOKEN_BALANCE: null,
	ETH_SET_TOKEN_ADDRESS: null,

	// auth
	AUTH_SET_AUTHENTICATING: null,
    AUTH_SET_AUTHENTICATED: null,
    AUTH_SET_USER: null,
	AUTH_SET_ETH_BALANCE: null,
	AUTH_SET_TOKEN_BALANCE: null,
	AUTH_SET_METAMASK_USE: null,
	AUTH_SET_IF_WEB3_INJECTED: null,

	// game
	GAME_SET_HASHED_SERVER_SEED: null,
	GAME_SET_CLIENT_SEED: null,
	GAME_SET_CHIP_INDEX: null,
	GAME_ADD_TO_BET: null,
	GAME_RESET_BET: null
});
