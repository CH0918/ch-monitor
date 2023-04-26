const path = require('path');
module.exports = {
  mode: 'production',
  entry: './src/monitor/index.js',
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'ch-monitor.umd.js',
    // umd 规范
    libraryTarget: 'umd',
    // 组件库暴露出来的 全局变量，比如 通过 script 方式引入 bundle 时就可以使用
    library: 'ch-monitor',
    // libraryExport: 'default',
  },
};
