/**
 * Base webpack config used across other specific configs
 */

let path = require('path');
let webpack = require('webpack');
let nodeExternals = require('webpack-node-externals');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports.default = {
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    sourceMap: "eval-source-map",
                }
            },
        }, {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
        }]
    },

    devtool: "eval",

    /**
     * Determine the array of extensions that should be used to resolve modules.
     */
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: [
            path.join(__dirname, 'app'),
            'node_modules',
        ],
    },

    externals: [nodeExternals()],
    target: "node",
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },

    plugins: [
        new webpack.DefinePlugin({
          'process.env': {
              NODE_ENV: JSON.stringify('production')
          }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            },
            output: {
                comments: false
            }
        })
    ],
};
