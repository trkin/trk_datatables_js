const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'index.js',
    library: 'trkDatatables',
    libraryTarget: 'umd',
  },
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
      },
      {
        parser: { amd: false },
      },
      {
        test: /\.(scss|sass|css)$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ]
      },
      {
         test: /\.(woff|woff2|eot|ttf|otf|png|svg|jpg|gif)$/,
         use: [
           'file-loader'
         ]
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
}
