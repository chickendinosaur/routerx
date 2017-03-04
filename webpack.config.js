const path = require('path');
const webpack = require('webpack');

process.env.NODE_ENV = 'development';

module.exports = {
	devtool: 'eval',
	devServer: {
		contentBase: path.join(__dirname, 'example'),
		publicPath: '/public',
		open: true,
		historyApiFallback: true,
		hot: true,
		inline: true,
		clientLogLevel: 'none'
	},
	entry: {
		commons: [],
		index: [
			'webpack/hot/only-dev-server',
			path.join(__dirname, 'example/app/index.js')
		]
	},
	output: {
		publicPath: '/public',
		filename: 'app/[name].js'
	},
	module: {
		rules: [
			{
				test: /\.js$|\.jsx$/,
				use: [
					'babel-loader'
				]
			}, {
				test: /\.css$|\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			}, {
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'assets/icons/[name].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'commons',
			// filename: 'app/commons.js', // Finds common imports across modules.
			minChunks: Infinity
		})
	],
	resolve: {
		extensions: [
			'.js',
			'.jsx',
			'.json',
			'.css',
			'.scss',
			'.html'
		],
		mainFields: [
			'browser',
			'jsnext:main',
			'main'
		]
	}
};
