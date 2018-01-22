import keymirror from 'keymirror';

export default keymirror({
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

	// game
	GAME_SET_HASHED_SERVER_SEED: null,
	GAME_SET_CLIENT_SEED: null,
	GAME_SET_BET_SIDE: null,
	GAME_SET_BET_MONEY: null
});
