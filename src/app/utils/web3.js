import Web3 from 'web3';
import { nodeUrl } from '../../common/constants/config';

export const web3 = new Web3(
	new Web3.providers.HttpProvider(nodeUrl)
	// new Web3.providers.WebsocketProvider(nodeUrl)
);

export default web3;
