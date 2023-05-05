import tracker from './utils/tracker';
import checkConfig from './utils/checkConfig';
import {
  handleResourceError,
  handleJsSyntaxError,
  handleUnhandledrejection,
  injectXHR,
  blankScreen,
  timming,
  longTask,
} from './lib/index.js';
export class ChMonitor {
  constructor(options = {}) {
    this.options = Object.assign({}, options, {
      monitorResourceErr: true,
      monitorJsErr: true,
      monitorPromiseErr: true,
      monitorBlankScreenErr: true,
      monitorXHRErr: true,
      monitorLongTask: true,
      monitorPermanceFirstInput: true,
      monitorPermancePain: true,
      monitorLoadTime: true,
    });
    this.init();
  }

  init() {
    if (!checkConfig(this.options.config)) return;
    this.monitor();
    return true;
  }

  monitor() {
    handleResourceError(this.options);
    handleJsSyntaxError(this.options);
    handleUnhandledrejection(this.options);
    injectXHR(this.options);
    blankScreen(this.options);
    timming(this.options);
    longTask(this.options);
  }
  // vue 插件
  install(Vue) {
    const options = this.options;
    if (!checkConfig(options.config)) return;
    const handler = Vue.config.errorHandler;
    // vue项目在Vue.config.errorHandler中上报错误
    const config = options.config || {};
    Vue.config.errorHandler = function (err, vm, info) {
      // 检测是否白屏
      monitorBlankScreen(options);
      tracker.send(
        {
          kind: 'stability',
          type: 'error',
          errorType: 'vueError',
          message: err.message,
        },
        config
      );
      console.error(err.message);
      if (handler) handler.apply(null, [err, vm, info]);
    };
  }
}

export function send(data, callback) {
  const config = data.config;
  if (!checkConfig(config)) return;
  delete data.config;
  tracker.send(data, config, callback);
}
export function monitorBlankScreen(data) {
  if (!checkConfig(data.config)) return;
  blankScreen(data);
}
