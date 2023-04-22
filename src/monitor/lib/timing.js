import onload from '../utils/onload';
import tracker from '../utils/tracker';
export function timming() {
  onload(function () {
    setTimeout(() => {
      const timming = performance.timing;
      console.log('timming = ', timming);
      const {
        fetchStart,
        connectStart,
        connectEnd,
        requestStart,
        responseStart,
        responseEnd,
        domLoading,
        domInteractive,
        domContentLoadedEventStart,
        domContentLoadedEventEnd,
        loadEventStart,
      } = performance.timing;
      const log = {
        kind: 'experience',
        type: 'timing',
        connectTime: connectEnd - connectStart, //TCP连接耗时
        ttfbTime: responseStart - requestStart, //ttfb
        responseTime: responseEnd - responseStart, //Response响应耗时
        parseDOMTime: loadEventStart - domLoading, //DOM解析渲染耗时
        domContentLoadedTime:
          domContentLoadedEventEnd - domContentLoadedEventStart, //DOMContentLoaded事件回调耗时
        timeToInteractive: domInteractive - fetchStart, //首次可交互时间
        loadTime: loadEventStart - fetchStart, //完整的加载时间
      };
      tracker.send(log);
    }, 3000);
  });
}
