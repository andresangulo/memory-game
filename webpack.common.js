const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const GoogleFontsPlugin = require('google-fonts-webpack-plugin');

const paths = {
    DIST: path.resolve(__dirname, 'dist'),
    SRC: path.resolve(__dirname, 'src')
};

module.exports = {
    entry: path.join(paths.SRC, 'App.jsx'),
    output: {
        path: paths.DIST,
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(paths.SRC, 'templates/index.html'),
        }),
        new ExtractTextPlugin('bundle.css'),
        new GoogleFontsPlugin({
            path: 'fonts/',
            local: true,
            fonts: [
//                {family: 'Roboto', variants: ['200', '300', '400', '500']}
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ],
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    use: 'css-loader',
                }),
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {loader: 'css-loader'},
                        {loader: 'less-loader'}
                    ],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: 'images/[name].[hash:8].[ext]',
                        limit: 1024
                    }
                }]
            },
            {
                test: /\.(pdf|eot|woff2?|ttf)(\?.*)?$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]'
                    }
                }]
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devServer: {
        contentBase: paths.SRC,
    }
};