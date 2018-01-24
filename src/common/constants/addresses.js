const env  = process.env.ETH_ENV === 'live' ?
			 'live' : process.env.ETH_ENV === 'testnet' ?
			 'testnet': 'private';

const addresses = {
	live: {},
	testnet: {
		token: '0x5e0c32857ddc47e2ca3cb1958b11263969ae706f',
		tokenSale: '0x69b825c672aa9722b58317eb886f7881e6432c61',
		game: '0x9eb780637d57456ee1bdd72e14ad4873cd1fc747'
	},
	private: {
		token: require('../../../build/contracts/Tulip.json')['networks']['6000']['address'],
		tokenSale: require('../../../build/contracts/TokenSale.json')['networks']['6000']['address'],
		game: require('../../../build/contracts/OddEven.json')['networks']['6000']['address']
	}
};


export const tokenAddress = addresses[env]['token'];
export const tokenSaleAddress = addresses[env]['tokenSale'];
export const gameAddress = addresses[env]['game'];
