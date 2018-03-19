import keymirror from 'keymirror';

export default keymirror({
	// global
	GLOBAL_SET_SIGNUP_MODAL: null,

	// auth
	AUTH_SET_AUTHENTICATING: null,
    AUTH_SET_AUTHENTICATED: null,
    AUTH_SET_USER: null,
    AUTH_SET_ETH_BALANCE: null,
	AUTH_SET_METAMASK_USE: null,
	AUTH_SET_METAMASK_NETWORK: null,
	AUTH_SET_IF_WEB3_INJECTED: null,

	// game
	GAME_SET_HASHED_SERVER_SEED: null,
	GAME_SET_CLIENT_SEED: null,
	GAME_SET_BET_INDEX: null,

	// results
	RESULTS_PUSH_GAME: null,
	RESULTS_CHANGE_GAME_STATE: null
});
