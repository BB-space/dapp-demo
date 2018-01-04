/* eslint-disable no-console */

const webpack          = require('webpack'),
      WebpackDevServer = require('webpack-dev-server'),
      config           = require('./webpack.config');



const PORT = process.env.PORT || 3000;


new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
        colors: true
    },
    proxy: {
        // '/apis/': 'http://192.168.18.62:10080'
    }
})
    .listen(PORT, function(err) {
        if (err) {
            console.log(err);
        }
        console.log('Listening at localhost:' + PORT);
    });
