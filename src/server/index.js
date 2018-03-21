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
import listenAndFinalize from './listenAndFinalize';
import { nodeUrl } from '../common/constants/config';
import { NUMBER_OF_SEEDS, INTERVAL_TO_REGEN_SEEDS, SEED_CHUNKS } from './constants/config'

// routes
import gameRoutes from './routes/games';
import authRoutes from './routes/auth';
import ethRoutes from './routes/eth';

import webpackConfig from '../../webpack.config';

import hashGenerator from './db/hashGenerator';

console.log(nodeUrl);

/*
* TODO:
* geth로부터 웹소켓 커넥션이 끊어졌을 경우의 대처가 명확하지 않다.
* 현재 시점에서는 Web3 의 동작을 정확히 알 수 없으니 이 부분도
* 테스트를 통해 대처 방법을 찾을 필요가 있다.
*/
function createWeb3() {
    let wsp = new Web3.providers.WebsocketProvider(nodeUrl);
    wsp.on('connect', e => {
        //console.log('ws-connect', e);
    })
    wsp.on('end', e => {
        // 연결이 종료된 경우
        // 이 경우는 에러가 아니라고 볼 수도 있지만 keepalive 시간이 지나면
        // 연결이 끊어질 수 있기 때문에 재연결 처리를 해야 한다.
        // 문제는 트랜잭션 처리 도중에 이 이벤트가 발생하는 경우인데...
        // 현재 시점에서는 어떻게 동작할지 알 수 없다.
        console.log('ws-end', e);
        global.web3 = createWeb3();
    })
    wsp.on('error', e => {
        // 에러에서도 일단 재연결한다.
        console.log('ws-error', e);
        global.web3 = createWeb3();
    })
    return new Web3(wsp);
}

global.web3 = createWeb3();

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

