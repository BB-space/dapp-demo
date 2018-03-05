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


global.web3 = new Web3(
	new Web3.providers.WebsocketProvider(nodeUrl)
	// 'ws://localhost:8545'
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
const { makeSignedTransaction } = require('./utils');

let gameInstance = new web3.eth.Contract(gameABI, gameAddress);

let seedMap = {
	'0xf02e2f5a0f96d0c6e7613a092db8b036af65be4feb29df084fb8025491d1b910': '111',
	'0x472e324fe0a3d839ff62fb9dac67e3685e0277bbe58a79c3f26693b85f8b5b35': '222',
	'0x9443d5f42d235cc94733a86239ffc70c7ea3c7f3951dafaf70e2feaba69eef15': '333',
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
			const txData = gameInstance
				.methods
				.finalize(
					dealerHash,
					stringToBytes32(dealerSeed)
				)
				.encodeABI();
			const wallet = '0x0f8b9f87eb70fe45c460aa50eee4f21957cb4d57';
			const nonce = await web3.eth.getTransactionCount(wallet);
			const privateKey = '0xd61612a42dbf4fbae245e8c8a3412c7613cee05752a8c86b68b52e009067e345';

			const tran = makeSignedTransaction(
				wallet,
				privateKey,
				gameAddress,
				'0',
				nonce,
				txData
			);

			tran.on('transactionHash', hash => {
				console.log('finalize transaction hash');
				console.log(hash);
			});

			tran.on('confirmation', (confirmationNumber, receipt) => {
				console.log('confirmation: ' + confirmationNumber);
			});

			tran.on('receipt', receipt => {
				console.log('reciept');
				console.log(receipt);
			});

			tran.on('error', console.error);

			

			// push hash
			

			
			

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
