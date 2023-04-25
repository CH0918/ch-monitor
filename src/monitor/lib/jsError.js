import tracker from '../utils/tracker';
import getSelector from '../utils/getSelector';
import getLastEvent from '../utils/getLastEvent';
import formatTime from '../utils/formatTime';

// 监控资源加载错误
export function handleResourceError(options = {}) {
  // 是否开启监控资源加载错误
  if (!options.monitorResourceErr) return;
  const config = options.config;
  const lastEvent = getLastEvent();
  window.addEventListener(
    'error',
    (event) => {
      if (event.target && (event.target.src || event.target.href)) {
        // 资源加载错误和js错误
        tracker.send(
          {
            kind: 'stability', //大类
            type: 'error', //小类
            errorType: 'resoueceError', //错误类型
            filename: event.target.src || event.target.href, //访问的文件名
            tagName: event.target.tagName,
            timeStamp: formatTime(event.timeStamp),
            selector: lastEvent
              ? getSelector(lastEvent.path || lastEvent.target)
              : '', //选择器
          },
          config
        );
      }
    },
    true
  );
}

// 监控js语法错误
export function handleJsSyntaxError(options = {}) {
  if (!options.monitorJsErr) return;
  const config = options.config;
  window.addEventListener('error', (event) => {
    if (!(event.target && (event.target.src || event.target.href))) {
      tracker.send(
        {
          kind: 'stability', //大类
          type: 'error', //小类
          errorType: 'jsError', //错误类型
          message: event.message, //类型详情
          filename: event.filename, //访问的文件名
          position: (event.lineno || 0) + ':' + (event.colno || 0), // 行列信息
          stack: getLines(event.error.stack), //堆栈信息
          selector: lastEvent
            ? getSelector(lastEvent.path || lastEvent.target)
            : '', //选择器
        },
        config
      );
    }
  });
}

export function handleUnhandledrejection(options = {}) {
  if (!options.monitorPromiseErr) return;
  const config = options.config;
  // promise 错误
  window.addEventListener('unhandledrejection', function (event) {
    let lastEvent = getLastEvent();
    let message = '';
    let line = 0;
    let column = 0;
    let file = '';
    let stack = '';
    if (typeof event.reason === 'string') {
      message = event.reason;
    } else if (typeof event.reason === 'object') {
      message = event.reason.message;
    }
    let reason = event.reason;
    if (typeof reason === 'object') {
      if (reason.stack) {
        var matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
        if (matchResult) {
          file = matchResult[1];
          line = matchResult[2];
          column = matchResult[3];
        }
        stack = getLines(reason.stack);
      }
      tracker.send(
        {
          //未捕获的promise错误
          kind: 'stability', //稳定性指标
          type: 'error', //jsError
          errorType: 'promiseError', //unhandledrejection
          message: message, //标签名
          filename: file,
          position: line + ':' + column, //行列
          stack,
          selector: lastEvent
            ? getSelector(lastEvent.path || lastEvent.target)
            : '',
        },
        config
      );
    }
  });
}

function getLines(stack) {
  if (!stack) {
    return '';
  }
  return stack
    .split('\n')
    .slice(1)
    .map((item) => item.replace(/^\s+at\s+/g, ''))
    .join('^');
}
