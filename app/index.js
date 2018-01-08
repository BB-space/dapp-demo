import React from 'react';
import Web3 from 'web3';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom'

import configureStore from './store/configureStore';
import routes from './routes';


const initialState = window.__INITIAL_STATE__ || {};
const store = configureStore(initialState);


(function injectWeb3() {
	if (typeof web3 !== 'undefined') {
		web3 = new Web3(web3.currentProvider);
	} else {
		// set the provider you want from Web3.providers
		web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
	}
})();

(function renderApp() {
	render(
		<Provider store={store}>
			<Router>
				{ routes }
			</Router>
		</Provider>,
		document.getElementById('root')
	);
})();
