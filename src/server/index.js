/* eslint-disable no-console */

const Koa					= require('koa'),
	  bodyParser			= require('koa-bodyparser'),
	  session				= require('koa-session'),
	  passport				= require('koa-passport'),
	  webpack				= require('webpack'),
	  webpackDevMiddleware	= require('koa-webpack-dev-middleware'),
	  webpackHotMiddleware	= require('koa-webpack-hot-middleware'),
	  gameRoutes			= require('./routes/games'),
	  authRoutes			= require('./routes/auth'),
	  ethRoutes				= require('./routes/eth'),
	  webpackConfig			= require('../../webpack.config');



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
