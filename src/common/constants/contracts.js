import gameSpec from '../../../build/contracts/OddEven.json';


const env  = process.env.ETH_ENV === 'live' ?
			 'live' : process.env.ETH_ENV === 'testnet' ?
			 'testnet': 'private';

const addresses = {
	live: {},
	testnet: {
		game: '0x9eb780637d57456ee1bdd72e14ad4873cd1fc747'
	},
	private: {
		game: gameSpec['networks']['6000']['address']
	}
};


export const gameAddress = addresses[env]['game'];

export const gameABI = gameSpec.abi;
