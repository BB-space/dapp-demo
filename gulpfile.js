const gulp = require('gulp'),
      gutil = require('gulp-util'),
      webpack = require('webpack'),
      path = require('path'),
      webpackConfig = require('./webpack.build.config');
      

// The development server (the recommended option for development)
gulp.task('default', ['webpack:build']);

gulp.task('webpack:build',
	  webpackBuild.bind(this, [webpackConfig], '[webpack:build]'));


function webpackBuild(config, logTitle, callback) {
    webpack(config, function(err, stats) {
	if(err) throw new gutil.PluginError(logTitle, err);
	gutil.log(logTitle, stats.toString({
	    colors: true
	}));
	callback();
    });
}
