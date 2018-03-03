import gameSpec from '../../../build/contracts/OddEven.json';
import { ethEnv } from './config';


const addresses = {
	live: {},
	testnet: {
		game: '0x97904b415f2b97ed69bd8cbc078a7c85b7653991'
	},
	npseth: {
		game: ''
	},
	local: {
		game: gameSpec['networks']['6000']['address']
	}
};

export const gameAddress = addresses[ethEnv]['game'];
export const gameABI = gameSpec.abi;
