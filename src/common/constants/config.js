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

export const NUMBER_OF_SEEDS = 10;
export const INTERVAL_TO_REGEN_SEEDS = 1000 * 60; // 1min

export const REDIS_URL = {
	local: { host: 'redis://localhost:6379', password: '' },
	npseth: { host: 'redis://eth3.npsdev.cloud:9379', password: 'spdhdnlwmfpeltm123' },
	testnet: { host: 'redis://localhost:6379', password: '' }
}


export { ethEnv };
export const nodeUrl = nodes[ethEnv];
