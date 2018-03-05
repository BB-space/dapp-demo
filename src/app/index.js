import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import MainApp from './components/MainApp';
import configureStore from './store/configureStore';
import web3, { setInjectedWeb3 } from './utils/web3';
import { setIfWeb3Injected } from './actions/authActions';



let initialState = window.__INITIAL_STATE__ || {};
const store = configureStore(initialState);


if (typeof window.web3 !== 'undefined') {
    // Save Mist/MetaMask's provider
    setInjectedWeb3(window.web3.currentProvider);
	store.dispatch(setIfWeb3Injected(true));
}



(function renderApp() {
	render(
		<Provider store={store}>
			<Router>
				<MainApp />
			</Router>
		</Provider>,
		document.getElementById('app')
	);
})();
