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
