import gameSpec from '../../../build/contracts/OddEven.json';
import { ethEnv } from './config';

function getAddress(network_id) {
	let o;
	return (o = gameSpec['networks']) && (o = o[network_id]) && (o = o['address'])
}

const addresses = {
	live: {},
	
	testnet: {
		game: '0x36c814f40c381c6828c022b5f8d6b4428b56432f'
	},
	
	npseth: {
		game: getAddress('1581')
	},
	
	local: {
		game: getAddress('6000')
	}
};


export const gameAddress = addresses[ethEnv]['game'];
export const gameABI = gameSpec.abi;
