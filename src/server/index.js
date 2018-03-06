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
	'0xdcaddd55043dce1a34357e873f5fc7ecfcaf2de23127b48ef2bd55172630cb3d': '1',
	'0x81f4bb8774c5c25c60ee666ed91449d0fe77ea15b018c58fca8d9946684d4e7a': '2',
	'0xddcfeeaf0105f9553c30dcd9c7be76a6f3e79728d1d3f3557fa63b5c5b1072eb': '3',
	'0x4a0ed17120ba64749280d002a74d49c966c01cfc2fcc53e72f8a6ca31b9c117b': '4',
	'0x0b61afd541802da7a5a207c71c2fb080011f4c1f7025d70a934a1d32e8d81f3e': '5',
	'0x3a0740360def08efe172f6b246b3c0703f9d448bdd83598eeb942d7d674a18c7': '6',
	'0x2a4704d8074a5b0e1d98009a8c4fd9301358fca5d3b7221f406909f7589d9178': '7',
	'0xbd2f2d1eec3e3c8b6f8aaf2e484b8b29ed19e3de05f2d160c493f0c2b8f84ee4': '8',
	'0xd2f32c45ad4a1f78adb02a09978d1393bf234a6d8d93d153cd2cc27f94101a7c': '9',
	'0x51eb3bd795b165fe617a260aed1c2807d8f2d365ab8fa444c7d53c2968724660': '0',
	'0xdfd1b59a80b362aeb910f35967542e3cac02e57c351ec804b490efd80b627d2f': 'q',
	'0xbe090c2f6e896c4d55578d81bf4ffc420865b09ca37898317f43e0182e3ed7fe': 'w',
	'0xf3796a9b13558a5be4d10932238c862cc18fbec559db6b50273e6174f44d003f': 'e',
	'0xec74de114b90f22c29a1d0e2308c93d90dbfe8ba8d1ac7c1297293bc78ede6d8': 'r',
	'0x24024eb2e36fd80ce65906771d04818f361030b687e5f84cbab7ab0f7489b60f': 't',
	'0x185fe5d267fde94f9f82765e471b37ef330912c412499d4c0d98e6bf01200c80': 'y',
	'0xac354f2cef7078657587a3c647fd2a853222d17550c9ef94a2ab6ad4942fb539': 'u',
	'0xaf2c9ee630c0ccff59e33ed7b8c14ef53db8b1826bcd74a05edbea2e9011b636': 'i',
	'0xdd6889b144b542e3585d1e69aca7ec06432cc10f852693d3733c6522455058c2': 'o',
	'0x50ce6a402fd10277e524902f84758804f74cd6e586a5ead3518f4d34c9bde62c': 'p',
	'0x14f2ae7a302c45ab5cbae57245cb0fc6bcdedabda29bfd5125e2598ffd9f164c': 'a',
	'0x29a41f4fed1a7a054f17b143eafb7651d6c2df769ae46be2bba33721a69023bd': 's',
	'0x389e594dcde303c5925cf51853872c5bea10e5b0cc067564a46ec4c4eaadc1d1': 'd',
	'0x4a3388a4a13a1081011ed63a4793d5efe7c32ed94c43fc65ff849c3442249ee2': 'f',
	'0xe62f3483d65258d4fb50c42e7e296f002a72a48f2426490c0a806936358d36b1': 'g',
	'0xd5efb36f3305a52a0eff2816cdf501a5365625e0eced21947411ca467d43fd10': 'h',
	'0x143a3e1052e7ece865bcc10020722adda395be7bda3fe287caccb2d31f763efe': 'j',
	'0x34c78e86c699b85702d57aa435c605c160c699e1f5eedc8ba3d641305f39ad63': 'k',
	'0xbb8b93870498c2cb288569198b6da636a2b364a074218ce51e7a55d301ba9a76': 'l',
	'0xc8d6e28a678a1339411fb443964a7400ffdc6c12abc7cf5f4841b4aad2868a5b': 'z',
	'0x2bdf9dcc5cc956642f26569c04b0a482427b9c7712dd92ad6528d688700612a9': 'x',
	'0xcc1db05b0ef9a0e08cbe1ae1dd5afbc3548878b661203aabefee96d8e027e2ae': 'c',
	'0x1c2dd395753ce49e7e31a3f07e10083171c31af179e5ab8b917a26f428db7926': 'v',
	'0xe8be74063ad7b17db5ba1581277a4a377b3d5bb79e8fcd6d277ae413dcfa5513': 'b',
	'0x099d28a047667686aaf90f5c328b5bdb9cfd740769461413a45da3184bd06959': 'n',
	'0xca1e471436d429718bd6feaccd49474e70ca4711d726c5b1a7a4eefc6069d0a2': 'm'
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
