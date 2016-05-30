'use strict';

import webpack from 'webpack';

// loaders to use for different file type
var loaders = [
  {
    //tell webpack to use babel for all *.js files
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel'
  },
  {
    test: /\.json$/,
    loader: 'json'
  }
];

// don't bundle these libraries
var externals =  {
  'react': 'React',
  'react-dom': 'ReactDOM',
  'redux': 'Redux',
  'react-redux': 'ReactRedux',
  'moment': 'moment'
};

var plugins = [
  new webpack.optimize.UglifyJsPlugin({minimize: true})
];

export default [
  {
    name: "browser",
    context: __dirname + "/../src/scripts",
    entry: "./client.js",
    module: {
      loaders: loaders
    },
    externals: externals,
    plugins: plugins,
    resolve: {
      extensions: ['', '.js', '.jsx', '.json'],
    },
    output: {
      path: __dirname + "/../public/assets/scripts",
      publicPath: "/assets/scripts",
      filename: "bundle.js"
    }
  }
];
