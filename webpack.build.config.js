const webpack			= require('webpack'),
	  path				= require('path'),
	  fs				= require('fs'),
	  HtmlWebpackPlugin = require('html-webpack-plugin'),
	  CopyWebpackPlugin = require('copy-webpack-plugin'),
	  WriteFilePlugin	= require('write-file-webpack-plugin'),
	  ExtractTextPlugin = require('extract-text-webpack-plugin');



const buildPathFilename = './buildpath.js',
      buildPath         = (fs.existsSync(buildPathFilename) && require(buildPathFilename))
                       || path.resolve(__dirname, 'dist'),
      mainPath          = path.resolve(__dirname, 'src', 'app', 'index.js');


module.exports = {
    devtool: 'cheap-module-source-map',
    entry: [
        'whatwg-fetch',
		'babel-polyfill',
        mainPath
    ],
    target: 'web',
    output: {
        path: buildPath,
        filename: 'bundle.[hash].js',
        publicPath: '/dist/'
    },
    resolve: {
        alias: {},
        modules: [
            path.join(__dirname, 'src', 'app'),
            'node_modules'
        ],
        extensions: ['.js', '.jsx', '.json'],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('build')
            }
        }),
        new ExtractTextPlugin({
            filename: 'style.[hash].css', 
            allChunks: true
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        // use only 'ko' locale in moment.js
		new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ko/),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
            },
            compress: {
                screw_ie8: true
            },
            comments: false
        }),
        new HtmlWebpackPlugin({
            template: '!!html-loader!src/templates/index.html',
            filename: 'index.html'
        }),
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, 'h5slot', 'slot'),
				to: path.join(buildPath, 'h5slot')
			},
		]),
		new WriteFilePlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['es2015', { modules: false }],
                                'stage-0',
                                'react'
                            ],
                            plugins: [ 'transform-decorators-legacy' ]
                        }
                    }
                ],
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                camelCase: true,
                                localIdentName: '[name]--[local]--[hash:base64:5]'
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () {
                                    return [ require('autoprefixer') ];
                                }
                            }
                        },
                        {
                            loader: 'resolve-url-loader',
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: [
                                    path.resolve(__dirname, 'app', 'stylesheets'),
                                    path.resolve(__dirname, './node_modules/compass-mixins/lib'),
                                    path.resolve(__dirname, './node_modules/bootstrap-sass/assets/stylesheets')
                                ]
                            }
                        }
                    ]
                })
            },
			{
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [ require('autoprefixer') ];
                            }
                        }
                    }
                ]
            },
            {
                test: /\.png$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100000
                        }
                    }
                ]
            },
            {
                test: /\.jpg$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
};
