import gameSpec from '../../../build/contracts/OddEven.json';
import { ethEnv } from './config';


const addresses = {
	live: {},
	testnet: {
		game: '0x9eb780637d57456ee1bdd72e14ad4873cd1fc747'
	},
	testnet: {
		game: ''
	},
	local: {
		game: gameSpec['networks']['6000']['address']
	}
};

export const gameAddress = addresses[ethEnv]['game'];
export const gameABI = gameSpec.abi;
