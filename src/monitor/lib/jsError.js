import tracker from '../utils/tracker';
import getSelector from '../utils/getSelector';
import getLastEvent from '../utils/getLastEvent';
import formatTime from '../utils/formatTime';

export function injectJsError() {
  // 加载资源错误，
  window.addEventListener(
    'error',
    (event) => {
      console.log('event = ', event);
      console.log('lastEvent = ', getLastEvent());
      const lastEvent = getLastEvent();

      if (event.target && (event.target.src || event.target.href)) {
        // 资源加载错误和js错误
        const log = {
          kind: 'stability', //大类
          type: 'error', //小类
          errorType: 'resoueceError', //错误类型
          filename: event.target.src || event.target.href, //访问的文件名
          tagName: event.target.tagName,
          timeStamp: formatTime(event.timeStamp),
          selector: lastEvent
            ? getSelector(lastEvent.path || lastEvent.target)
            : '', //选择器
        };
        tracker.send(log);
      } else {
        // js错误
        const log = {
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
        };
        tracker.send(log);
      }
      // tracker.send(log);
    },
    true
  );

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
      const log = {
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
      };
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
