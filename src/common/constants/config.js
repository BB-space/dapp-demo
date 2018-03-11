import { isBrowser } from '../../common/utils';


let ethEnv = isBrowser() ?
			 window.__ETH_ENV__ : process.env.ETH_ENV;

ethEnv = ethEnv === 'live' ?
		 'live' : ethEnv === 'testnet' ?
		 'testnet': ethEnv === 'npseth' ?
		 'npseth' : 'local';


const nodes = {
	local: 'ws://localhost:8545',
	npseth: 'ws://eth2.npsdev.cloud:8546',
	testnet: 'ws://localhost:8545'
};


export { ethEnv };
export const nodeUrl = nodes[ethEnv];
