const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  context: process.cwd(),
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'monitor.js',
  },
  devServer: {
    // contentBase: path.resolve(__dirname, 'dist'),
    onBeforeSetupMiddleware: function (devServer) {
      const router = devServer.app;
      router.get('/success', function (req, res) {
        res.json({ id: 1 });
      });
      router.post('/error', function (req, res) {
        res.sendStatus(500);
      });
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head',
    }),
  ],
  devtool: 'source-map',
};
