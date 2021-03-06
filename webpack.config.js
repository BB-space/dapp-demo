const path              = require('path'),
      webpack           = require('webpack'),
	  CopyWebpackPlugin = require('copy-webpack-plugin'),
	  WriteFilePlugin	= require('write-file-webpack-plugin');


const PORT      = process.env.PORT || 3000,
      buildPath = path.resolve(__dirname, 'dist'),
      mainPath  = path.resolve(__dirname, 'src', 'app', 'index.js');



module.exports = {
    devtool: 'source-map',
    entry: [
		'webpack-hot-middleware/client?reload=true',
        'webpack/hot/only-dev-server',
		'babel-polyfill',
        'whatwg-fetch',
		mainPath
	],
    target: 'web',
    output: {
        path: buildPath,
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    resolve: {
        alias: {},
        modules: [
            path.join(__dirname, 'src'),
            'node_modules'
        ],
        extensions: ['.js', '.jsx', '.json']
    },
    plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            _: 'lodash'
        }),
        new webpack.NoEmitOnErrorsPlugin(),
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, 'h5slot', 'slot'),
				to: path.join(__dirname, 'dist', 'h5slot')
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
                                'react',
                                'react-hmre'
                            ],
                            plugins: [ 'transform-decorators-legacy' ]
                        }
                    }
                ],
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: true,
                            camelCase: true,
                            localIdentName: '[name]--[local]--[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
							sourceMap: true,
                            plugins: function () {
                                return [ require('autoprefixer') ];
                            }
                        }
                    },
                    {
                        loader: 'resolve-url-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
							sourceMap: true,
                            includePaths: [
                                path.resolve(__dirname, 'src', 'app', 'stylesheets'),
								path.resolve(__dirname, './node_modules'),
								path.resolve(__dirname, './node_modules/compass-mixins/lib'),
								path.resolve(__dirname, './node_modules/bootstrap-sass/assets/stylesheets')
                            ]
                        }
                    }
                ]
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
                    'file-loader',
                ]
            }
        ]
    }
};
