const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
    './client/entry.js'
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public', 'javascripts')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react', 'react-hmre', 'stage-2'],
          cacheDirectory: false
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  devtool: 'source-map'
};
