import tracker from '../utils/tracker';
import formatTime from '../utils/formatTime';
import getLastEvent from '../utils/getLastEvent';
import getSelector from '../utils/getSelector';
export function longTask(options = {}) {
  const { monitorLongTask, longTaskTime, config } = options;
  if (monitorLongTask) return;
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.duration > (longTaskTime || 100)) {
        let lastEvent = getLastEvent();
        requestIdleCallback(() => {
          tracker.send(
            {
              kind: 'experience',
              type: 'longTask',
              eventType: lastEvent.type,
              startTime: formatTime(entry.startTime), // 开始时间
              duration: formatTime(entry.duration), // 持续时间
              selector: lastEvent
                ? getSelector(lastEvent.path || lastEvent.target)
                : '',
            },
            config
          );
        });
      }
    });
  }).observe({ entryTypes: ['longtask'] });
}
