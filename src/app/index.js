import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import MainApp from './components/MainApp';
import configureStore from './store/configureStore';
import routes from './routes';


const initialState = window.__INITIAL_STATE__ || {};
const store = configureStore(initialState);


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
