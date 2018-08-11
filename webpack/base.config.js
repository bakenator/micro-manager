const resolve = require("path").resolve;
const webpack = require("webpack");
const path = `${process.cwd()}/public`;
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: ['./app/app.js', './app/style.scss'],
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path
  },
  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        // sass / scss loader for webpack
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract({
          use: ["css-loader", "sass-loader"]
        })
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: "app.bundle.css"
    })
  ]
};