
var webpack = require('webpack');

// loaders to use for different file type
var loaders = [
  {
    //tell webpack to use jsx-loader and babel for all *.jsx files
    test: /\.jsx$/,
    loaders: [
      'jsx?insertPragma=React.DOM&harmony',
      'babel?stage=1'
    ]
  },
  {
    //tell webpack to use babel for all *.js files
    test: /\.js$/,
    loaders: [
      'babel?stage=1'
    ]
  }
];

// don't bundle these libraries
var externals =  {
  //don't bundle the 'react' npm package with our bundle.js
  //but get it from a global 'React' variable
  'react': 'React'
};

var plugins = [
  new webpack.optimize.UglifyJsPlugin({minimize: true})
];

module.exports = [
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
      extensions: ['', '.js', '.jsx'],
      alias: {
          "request": "browser-request"
      }
    },
    output: {
      path: __dirname + "/../public/assets/scripts",
      filename: "bundle.js"
    }
  }
];
