import Web3 from 'web3';
import { nodeUrl } from '../../common/constants/config';


export const serviceWeb3 = new Web3(
	new Web3.providers.WebsocketProvider(nodeUrl)
	// new Web3.providers.HttpProvider(nodeUrl)
);

export let injectedWeb3 = undefined;

export function setInjectedWeb3(provider) {
	injectedWeb3 = new Web3(provider);
}

export default serviceWeb3;
