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
	'0x9b1a4dab1a7025ad6dba6e13d87ea8ea934b9b1b572469d285e906ead52fe8a6': 'very11',
	'0x1fe891ef181bbaa0ca4b6c06006e2becc4cca13f88682284d9e82aa82372e758': 'seeds',
	'0x7d8bf1f68ea62ccdc2cddb984b9e0e4d4fb0e4a620488813790a764cf1920983': 'strong111',
	'0x62a7249a1f7f289baf0456ee2de6123da3e57a39671ca7b0f7b7640ad866e9d9': 'abc',
	'0xdb933f2a0bb951b5c20ee044393808ca76b6474ea10cc8df65a9b7f37a1a78e6': 'def',
	'0x186865c7f283a132acec923b1a7aeb8eaffeaf5ffd26b12d835445af6b58ad28': 'ghi',
	
	'0x0b57f84596d20883bde0a6fae29719f091e59c30ed4fcebc3687dbf1e1085875': '123',
	'0x6646cdc81d54f479b9ab34e53644efe58928b480e80fe4014ff718128461a4cd': '456',
	'0x19d23dbe4c2d3b0b3009beccb163055aec1cb81e05e0fcb9f06bbaf85f2ae8a4': '789',
	
	'0xdd6889b144b542e3585d1e69aca7ec06432cc10f852693d3733c6522455058c2': '111',
	'0xc96acbd0ceca423fa399cdd99e791eb3e691f44ecbcea42eef6503f3ff933ae8': '222',
	'0x80e9c5f5fa74fa7d584b3e31c075fc1bab83fd3ddba39bf5b39f35e5ee79f255': '333',
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
