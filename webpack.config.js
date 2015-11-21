module.exports = {
  entry: {
    bundle:  __dirname + '/src/index.jsx'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }, {
        test: /\.css$/,
        loader: "style!css"
      }, {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
      },
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  },
}


