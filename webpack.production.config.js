'use strict';

let webpack = require('webpack');
let path = require('path');

module.exports = {
  entry: {
    bundle:  __dirname + '/src/index.jsx'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        include: [path.resolve(__dirname + '/src/')],
        // exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }, {
        test: /\.css$/,
        loader: "style!css?minimize!postcss"
      }, {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
      },
    ]
  },
  postcss: function () {
      return [require('autoprefixer'), require('precss')];
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production')
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ]
}


