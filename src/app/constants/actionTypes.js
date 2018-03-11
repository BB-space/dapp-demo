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
	GAME_SET_CHIP_INDEX: null,
	GAME_ADD_TO_BET: null,
	GAME_RESET_BET: null,

	// result
	RESULT_SET_IS_PLAYING: null,
	RESULT_SET_CLIENTSEED: null,
	RESULT_SET_SERVERSEED: null,
	RESULT_SET_HASHED_SERVER_SEED: null,
	RESULT_SET_REWARD: null
});
