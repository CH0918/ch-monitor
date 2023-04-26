import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// 引入监控插件
import { send, monitorBlankScreen, ChMonitor } from '@ch0918/monitor';

const monitor = new ChMonitor({
  config: {
    host: 'cn-guangzhou.log.aliyuncs.com',
    project: 'ch-monitor',
    logstore: 'ch-monitor-store',
  },
});
console.log('monitor = ', monitor);
send(
  {
    config: {
      host: 'cn-guangzhou.log.aliyuncs.com',
      project: 'ch-monitor',
      logstore: 'ch-monitor-store',
    },
    uid: 1,
    token: 'abc',
  },
  () => {
    console.log('send success');
  }
);
const app = createApp(App);
app.use(monitor);
app.use(router);
app.mount('#app');
