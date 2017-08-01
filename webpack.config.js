var webpack = require('webpack');
var path = require('path');
var fs = require('fs-extra');
var webpackMerge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackOnBuildPlugin = require('on-build-webpack');
var bootstrap = require('bootstrap-styl');

// Webpack Config
var webpackConfig = {
  entry: {
    'main': './src/main.browser.ts',
    'bootstrap': './src/app/styles.styl'
  },

  output: {
    publicPath: '',
    path: path.resolve(__dirname, './dist'),
  },

  plugins: [
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(__dirname, '../src'),
      {
        // your Angular Async Route paths relative to this root directory
      }
    ),

    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),

    new WebpackOnBuildPlugin(function(stats) {
      fs.copySync('src/assets', 'dist/assets')
    }),

    new webpack.LoaderOptionsPlugin({
      stylus: { use: [bootstrap()] },
    }),

  ],

  module: {
    loaders: [
      // .ts files for TypeScript
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          'angular2-template-loader',
          'angular2-router-loader'
        ]
      },
      { test: /\.css$/, loaders: ['to-string-loader', 'css-loader'] },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.pug$/, loader: 'pug-loader' },
      { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file?name=node_modules/bootstrap-styl/fonts/[name].[ext]' },
      { test: /\.styl$/, loader: 'css-loader!stylus-loader?paths=node_modules/bootstrap-styl' },
      { test: /\.styl$/, loader: 'css-loader!stylus-loader?paths=node_modules/bootstrap-stylus/stylus/' }
    ]
  }

};



// Our Webpack Defaults
var defaultConfig = {
  devtool: 'source-map',

  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: [ '.ts', 'styl', '.js' ],
    modules: [ path.resolve(__dirname, 'node_modules') ]
  },

  devServer: {
    historyApiFallback: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },

  node: {
    global: true,
    crypto: 'empty',
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false,
    clearImmediate: false,
    setImmediate: false
  }
};


module.exports = webpackMerge(defaultConfig, webpackConfig);
