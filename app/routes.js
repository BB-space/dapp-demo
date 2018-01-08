import React from 'react';
import { Route } from 'react-router-dom'


import MainApp from './components/MainApp';
import MainPage from './components/main/MainPage';


const routes = (
	<MainApp>
		<Route exact path="/"
			   component={MainPage} />
	</MainApp>
);


export default routes;
