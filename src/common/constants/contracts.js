import gameSpec from '../../../build/contracts/OddEven.json';
import { ethEnv } from './config';


const addresses = {
	live: {},
	
	testnet: {
		game: '0x36c814f40c381c6828c022b5f8d6b4428b56432f'
	},
	
	npseth: {
		game: '0xf204a4ef082f5c04bb89f7d5e6568b796096735a'
	},
	
	local: {
		game: gameSpec['networks']['6000']['address']
	}
};


export const gameAddress = addresses[ethEnv]['game'];
export const gameABI = gameSpec.abi;
