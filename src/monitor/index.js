import tracker from './utils/tracker';
import {
  handleResourceError,
  handleJsSyntaxError,
  handleUnhandledrejection,
  injectXHR,
  blankScreen,
  timming,
  longTask,
} from './lib';

export default class ChMonitor {
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
    const { host, project, logstore } = this.options.config || {};
    if (!host || !project || !logstore) {
      console.error('参数host, project, logstore为上传阿里云日志库的必填参数');
      return;
    }
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
    const { host, project, logstore } = this.options.config || {};
    if (!host || !project || !logstore) {
      console.error('参数host, project, logstore为上传阿里云日志库的必填参数');
      return;
    }
    const handler = Vue.config.errorHandler;
    // vue项目在Vue.config.errorHandler中上报错误
    const config = this.options.config || {};
    Vue.config.errorHandler = function (err, vm, info) {
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
  send(data, callback) {
    tracker.send(data, this.options.config, callback);
  }
}
