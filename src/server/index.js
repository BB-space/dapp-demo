/* eslint-disable no-console */

import Koa from 'koa';
import render from 'koa-ejs';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import passport from 'koa-passport';
import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import runDevServer from './runDevServer';
import renderApp from './renderApp';
import listenAndFinalize from './listenAndFinalize';
import { NUMBER_OF_SEEDS, INTERVAL_TO_REGEN_SEEDS, SEED_CHUNKS } from './constants/config'
import { Web3, createGlobalWeb3 } from './utils/web3';
import { Mutex } from 'await-semaphore';

// routes
import gameRoutes from './routes/games';
import authRoutes from './routes/auth';
import ethRoutes from './routes/eth';

import webpackConfig from '../../webpack.config';

import hashGenerator from './db/hashGenerator';

// account lock
global.accountLock = new Mutex();

// global.web3
createGlobalWeb3();

// 주기적으로 시드정보를 생성하기 위한 함수
var genfunc = function() {
    genfunc = function() {
        let start = Date.now();
        hashGenerator.generate(NUMBER_OF_SEEDS)
        .finally (() => {
            let elapsed = Date.now() - start;
            let nextTurnDelay = INTERVAL_TO_REGEN_SEEDS - elapsed;
            setTimeout(genfunc, nextTurnDelay > 0 ? nextTurnDelay : 0);
        });
    };
    genfunc();
    return genfunc;
}();

const frontApp = new Koa();  // Renderer
const backApp = new Koa();   // REST API


const isBuildEnv	= process.env.NODE_ENV === 'build',
      port          = process.env.PORT || 3000,
      templatesPath = path.resolve(__dirname, '..', 'templates');


const buildPathFilename = path.resolve(__dirname, '../..', 'buildpath.js'),
      buildPath         = (fs.existsSync(buildPathFilename) && require(buildPathFilename))
                          || path.resolve(__dirname, '../..', 'dist');



/* Run webpack-dev-server in dev env */
if (!isBuildEnv) {
    runDevServer(frontApp);
}


/* Listen to InitGame Events and Finalize */
listenAndFinalize(web3);


/* Renderer */
render(frontApp, {
    root: isBuildEnv? buildPath : templatesPath,
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: false
});

frontApp.use(renderApp);




/* REST API */

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






frontApp.on('error', function(err) {
    if (typeof err === 'object') {
        if (err.message) {
            console.log('\nError: ' + err.message);
        }
        if (err.stack) {
            console.log('\nStacktrace:');
            console.log('====================');
            console.log(err.stack);
        }
    } else {
        console.log('dumpError :: argument is not an object');
    }
});

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

