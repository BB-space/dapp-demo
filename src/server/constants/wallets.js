import { ethEnv } from '../../common/constants/config';


const wallets = {
	live: {},
	
	testnet: {
		coinbase: '0x0f8b9f87eb70fe45c460aa50eee4f21957cb4d57',
		privateKey: '0xd61612a42dbf4fbae245e8c8a3412c7613cee05752a8c86b68b52e009067e345'
	},
	
	npseth: {
		game: '0x36c814f40c381c6828c022b5f8d6b4428b56432f' // false
	},
	
	local: {
		coinbase: '0xc31eb6e317054a79bb5e442d686cb9b225670c1d',
		privateKey: '0x3e722ce009e8acbfad73048108d965b6e38c8d2051d4feaef9fe8d867de7f62c'
	}
};


export const coinbase = wallets[ethEnv]['coinbase'];
export const privateKey = wallets[ethEnv]['privateKey'];
