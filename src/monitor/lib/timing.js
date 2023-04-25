import onload from '../utils/onload';
import tracker from '../utils/tracker';
import getLastEvent from '../utils/getLastEvent';
import getSelector from '../utils/getSelector';
import formatTime from '../utils/formatTime';

export function timming(options = {}) {
  const {
    monitorPermanceFirstInput,
    monitorPermancePain,
    monitorLoadTime,
    config,
  } = options;
  if (!monitorPermanceFirstInput && !monitorLoadTime && !monitorPermancePain)
    return;
  let FMP, LCP;
  // 检测FMP的元素，当某个元素添加elementtiming为meaningful的话会被监控起来
  new PerformanceObserver((entryList, observer) => {
    let perfEntries = entryList.getEntries();
    FMP = perfEntries[0];
    observer.disconnect();
  }).observe({ entryTypes: ['element'] });

  // 检测LCP
  new PerformanceObserver((entryList, observer) => {
    const perfEntries = entryList.getEntries();
    const lastEntry = perfEntries[perfEntries.length - 1];
    LCP = lastEntry;

    observer.disconnect();
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // 检测FID 首次输入延迟时间
  if (monitorPermanceFirstInput) {
    new PerformanceObserver(function (entryList, observer) {
      let lastEvent = getLastEvent();
      const firstInput = entryList.getEntries()[0];
      if (firstInput) {
        let inputDelay = firstInput.processingStart - firstInput.startTime; //处理延迟
        let duration = firstInput.duration; //处理耗时
        if (firstInput > 0 || duration > 0) {
          tracker.send(
            {
              kind: 'experience',
              type: 'firstInputDelay',
              inputDelay: inputDelay ? formatTime(inputDelay) : 0,
              duration: duration ? formatTime(duration) : 0,
              startTime: firstInput.startTime,
              selector: lastEvent
                ? getSelector(lastEvent.path || lastEvent.target)
                : '',
            },
            config
          );
        }
      }
      observer.disconnect();
    }).observe({ type: 'first-input', buffered: true });
  }

  onload(function () {
    setTimeout(() => {
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
      // 加载时间
      if (monitorLoadTime) {
        console.log('run...........');
        tracker.send(
          {
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
          },
          config
        );
      }

      // 绘制时间
      const FP = performance.getEntriesByName('first-paint')[0];
      const FCP = performance.getEntriesByName('first-contentful-paint')[0];

      if (monitorPermancePain) {
        setTimeout(() => {
          tracker.send(
            {
              kind: 'experience',
              type: 'paint',
              firstPaint: FP ? formatTime(FP.startTime) : 0,
              firstContentPaint: FCP ? formatTime(FCP.startTime) : 0,
              firstMeaningfulPaint: FMP ? formatTime(FMP.startTime) : 0,
              largestContentfulPaint: LCP
                ? formatTime(LCP.renderTime || LCP.loadTime)
                : 0,
            },
            config
          );
        }, 300);
      }
    }, 3000);
  });
}
