const path = require('path');
module.exports = {
  mode: 'development',
  entry: './src/monitor/index.js',
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'ch-monitor.common.js',
    libraryTarget: 'commonjs2',
    // libraryExport: 'default',
  },
};
