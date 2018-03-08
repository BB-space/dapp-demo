import gameSpec from '../../../build/contracts/OddEven.json';
import { ethEnv } from './config';


const addresses = {
	live: {},
	testnet: {
		game: '0x36c814f40c381c6828c022b5f8d6b4428b56432f'
	},
	npseth: {
		game: '0x36c814f40c381c6828c022b5f8d6b4428b56432f'
	},
	local: {
		game: gameSpec['networks']['6000']['address']
	}
};

export const gameAddress = addresses[ethEnv]['game'];
export const gameABI = gameSpec.abi;
