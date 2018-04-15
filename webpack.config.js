const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const config = {
  target: 'web',
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader', 
            options: {
              limit: 1024,
              name: '[name]-incode.[ ext]'
            }
          }
        ]
      },
      
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env' : {
        NODE_ENV : isDev ? '"development"' : '"production"' 
      }
    }),
    new HTMLPlugin()
  ]
};

if (isDev) {
  config.module.rules.push({
    test: /\.styl$/,
    use:[
      'style-loader',
      'css-loader',
      {
        loader:'postcss-loader',
        options:{
          sourceMap:true,
        }
      },
      'stylus-loader'
    ]
  })
  config.devtool = '#cheap-module-eval-source-map',
  config.devServer = {
    overlay :{
      errors : true,
    },
    hot : true
  },
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
}else{
  config.output.filename = '[name].[chunkhash:8].js'
  config.module.rules.push({
    test: /\.styl$/,
    use:ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use:[
        'css-loader',
        {
          loader:'postcss-loader',
          options:{
            sourceMap:true,
          }
        },
        'stylus-loader'
      ]
    })
  },)
  config.plugins.push(
    new ExtractTextPlugin({filename:'styles.[contentHash:8].css',})
  )
}

module.exports = config;