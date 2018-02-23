import webpack from 'webpack';
import path from 'path';
import proxy from 'koa-proxy';
import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import webpackConfig from '../../webpack.config.js';


const compiler = webpack(webpackConfig);

export default function runDevServer(app) {
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        hot: true,
        quiet: false,
        noInfo: true,
        stats: {
            colors: true
        }
    }))
       .use(webpackHotMiddleware(compiler))
	   .use(proxy({
			host: 'http://localhost:3001',
			match: /^\/api\//
		}));
}
