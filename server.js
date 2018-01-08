/* eslint-disable no-console */

const express				= require('express'),
	  webpack				= require('webpack'),
	  webpackDevMiddleware	= require('webpack-dev-middleware'),
	  webpackHotMiddleware	= require('webpack-hot-middleware'),
      webpackConfig			= require('./webpack.config');


const app = express();
const PORT = process.env.PORT || 3000;

const compiler = webpack(webpackConfig);


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
   .listen(PORT, function(err) {
        if (err) {
            console.log(err);
        }
        console.log('Listening at localhost:' + PORT);
    });
