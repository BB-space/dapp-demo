/* eslint-disable no-console */

import Koa from 'koa';
import render from 'koa-ejs';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import passport from 'koa-passport';
import path from 'path';
import fs from 'fs';
import Web3 from 'web3';
import webpack from 'webpack';
import runDevServer from './runDevServer';
import renderApp from './renderApp';

// routes
import gameRoutes from './routes/games';
import authRoutes from './routes/auth';
import ethRoutes from './routes/eth';


import webpackConfig from '../../webpack.config';
import { nodeUrl } from '../common/constants/config';

console.log('node url:', nodeUrl)

global.web3 = new Web3(
	//new Web3.providers.WebsocketProvider(nodeUrl)
	'ws://localhost:8545'
);

const frontApp = new Koa();
const backApp = new Koa();


const isBuildEnv	= process.env.NODE_ENV === 'build',
      port          = process.env.PORT || 3000,
      templatesPath = path.resolve(__dirname, '..', 'templates');


const buildPathFilename = path.resolve(__dirname, '../..', 'buildpath.js'),
      buildPath         = (fs.existsSync(buildPathFilename) && require(buildPathFilename))
                          || path.resolve(__dirname, '../..', 'dist');


if (!isBuildEnv) {
    runDevServer(frontApp);
}

render(frontApp, {
    root: isBuildEnv? buildPath : templatesPath,
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: true
});

frontApp.use(renderApp);


// sessions
backApp.keys = ['super-secret-key!'];
backApp.use(session({ key: 'backApp:sess' }, backApp));

// body parser
backApp.use(bodyParser());

// authentication
require('./auth');
backApp.use(passport.initialize())
	   .use(passport.session());


// routes
backApp.use(gameRoutes.routes())
   .use(authRoutes.routes())
   .use(ethRoutes.routes());



// finalize when InitGame event emitted
// TODO: seed-hash management in database

const { gameABI, gameAddress } = require('../common/constants/contracts');
const { stringToBytes32 } = require('../common/utils');
let gameInstance = new web3.eth.Contract(gameABI, gameAddress);

let seedMap = {
	'0x9b1a4dab1a7025ad6dba6e13d87ea8ea934b9b1b572469d285e906ead52fe8a6': 'very11',
	'0x1fe891ef181bbaa0ca4b6c06006e2becc4cca13f88682284d9e82aa82372e758': 'seeds',
	'0x7d8bf1f68ea62ccdc2cddb984b9e0e4d4fb0e4a620488813790a764cf1920983': 'strong111'
};

gameInstance.events.InitGame(async (err, result) => {
	if(err) {
		console.error(err);
	} else {
		const {
			betData,
			dealerHash,
			player,
			playerSeed
		} = result.returnValues;

		console.log('InitGame event has been emitted!!');
		console.log('Dealer Hash:', dealerHash);

		const dealerSeed = seedMap[dealerHash];
		console.log('Original Seed:', dealerSeed);

		try {
			await gameInstance
				.methods
				.finalize(
					dealerHash,
					stringToBytes32(dealerSeed)
				)
				.send({
					from: '0x0f8b9f87eb70fe45c460aa50eee4f21957cb4d57'  // TODO
				});
		} catch(e) {
			console.error(e);
		}
	}
})




/* frontApp.on('error', function(err) {
 *     if (typeof err === 'object') {
 *         if (err.message) {
 *             console.log('\nError: ' + err.message);
 *         }
 *         if (err.stack) {
 *             console.log('\nStacktrace:');
 *             console.log('====================');
 *             console.log(err.stack);
 *         }
 *     } else {
 *         console.log('dumpError :: argument is not an object');
 *     }
 * });*/

frontApp.listen(port, () => {
    console.log({
        port,
        env: process.env.NODE_ENV,
        pid: process.pid
    }, 'Front Server is listening');
});


backApp.listen(port + 1, () => {
    console.log({
        port: port + 1,
        env: process.env.NODE_ENV,
        pid: process.pid
    }, 'Back Server is listening');
});
