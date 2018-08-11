const resolve = require("path").resolve;
const webpack = require("webpack");
const path = `${process.cwd()}/server`;
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// hack from here for node modules https://jlongster.com/Backend-Apps-with-Webpack--Part-I
var fs = require('fs');
var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: ['./server/server.js'],
  target : 'node',
  output: {
    filename: 'server.bundle.js',
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
  externals: nodeModules,
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: "app.bundle.css"
    })
  ]
};