/* eslint-disable no-console */

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import passport from 'koa-passport';
import Web3 from 'web3';
import webpack from 'webpack';
import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import gameRoutes from './routes/games';
import authRoutes from './routes/auth';
import ethRoutes from './routes/eth';
import webpackConfig from '../../webpack.config';
import { nodeUrl } from '../common/constants/config';


global.web3 = new Web3(
	new Web3.providers.WebsocketProvider(nodeUrl)
);

const app = new Koa();
const PORT = process.env.PORT || 3000;

const compiler = webpack(webpackConfig);




// sessions
app.keys = ['super-secret-key!'];
app.use(session({ key: 'app:sess' }, app));

// body parser
app.use(bodyParser());

// authentication
require('./auth');
app.use(passport.initialize());
app.use(passport.session());


// routes
app.use(gameRoutes.routes());
app.use(authRoutes.routes());
app.use(ethRoutes.routes());


app
	.use(webpackDevMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath,
		hot: true,
		quiet: false,
		noInfo: true,
		stats: {
			colors: true
		}
	}))
	.use(webpackHotMiddleware(compiler))
	.listen(PORT, function(err) {
        if (err) {
            console.log(err);
        }
        console.log('Listening at localhost:' + PORT);
    });
