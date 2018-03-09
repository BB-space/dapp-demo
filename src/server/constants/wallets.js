import { ethEnv } from '../../common/constants/config';


const wallets = {
	live: {},
	
	testnet: {
		coinbase: '0x0f8b9f87eb70fe45c460aa50eee4f21957cb4d57',
		privateKey: '0xd61612a42dbf4fbae245e8c8a3412c7613cee05752a8c86b68b52e009067e345'
	},
	
	npseth: {
		coinbase: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
		privateKey: '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'
	},
	local: {
		coinbase: '0xc31eb6e317054a79bb5e442d686cb9b225670c1d',
		privateKey: '0x3e722ce009e8acbfad73048108d965b6e38c8d2051d4feaef9fe8d867de7f62c'
	}
};


export const coinbase = wallets[ethEnv]['coinbase'];
export const privateKey = wallets[ethEnv]['privateKey'];
