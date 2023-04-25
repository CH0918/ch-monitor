import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// 引入监控插件
import ChMonitor from '../../src/index';
const monitor = new ChMonitor({
  config: {
    host: 'cn-guangzhou.log.aliyuncs.com',
    project: 'ch-monitor',
    logstore: 'ch-monitor-store',
  },
});
monitor.send({ uid: 1, token: 'abc' }, () => {
  console.log('send success');
});
const app = createApp(App);
app.use(monitor);
app.use(router);
app.mount('#app');
