const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      path: path.join(__dirname, 'dist', 'public'),
      publicPath: '/assets/',
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  devtool: 'source-map',
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist', 'public'),
    publicPath: '/assets/',
  },
  devServer: {
    host: 'localhost',
    port: 5001,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/assets/',
            },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
      },
    ],
  },
};
