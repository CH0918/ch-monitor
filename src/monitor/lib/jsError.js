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
        debugger;
      }
      // tracker.send(log);
    },
    true
  );
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
