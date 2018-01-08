const path              = require('path'),
      webpack           = require('webpack'),
      HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    devtool: 'source-map',
    entry: [
		'webpack-hot-middleware/client?reload=true',
        'webpack/hot/only-dev-server',
		'babel-polyfill',
        'whatwg-fetch',
		'./app/index.js',
	],
    target: 'web',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    resolve: {
        alias: {},
        modules: [
            path.join(__dirname, 'app'),
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
		new HtmlWebpackPlugin({
            template: './app/index.html',
            filename: 'index.html'
		})
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
                                path.resolve(__dirname, 'app', 'stylesheets'),
								path.resolve(__dirname, './node_modules/compass-mixins/lib')
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
