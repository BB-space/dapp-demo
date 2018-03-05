import gameSpec from '../../../build/contracts/OddEven.json';
import { ethEnv } from './config';


const addresses = {
	live: {},
	testnet: {
		game: '0x76ad555a7f3cf02b628fc5a9cb82e134f5c4bb7a'
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
