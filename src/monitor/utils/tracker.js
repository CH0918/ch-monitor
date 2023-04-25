var userAgent = require('user-agent');
function getExtraData() {
  return {
    title: document.title,
    url: location.href,
    timestamp: Date.now(),
    userAgent: userAgent.parse(navigator.userAgent).name,
  };
}
class SendTracker {
  constructor() {
    // this.url = `http://${project}.${host}/logstores/${logstore}/track`;
    this.xhr = new XMLHttpRequest();
  }
  send(data = {}, config, callback) {
    let extraData = getExtraData();
    let logs = { ...extraData, ...data };
    for (let key in logs) {
      if (typeof logs[key] === 'number') {
        logs[key] = '' + logs[key];
      }
    }
    // console.log(logs);
    console.log(JSON.stringify(logs, null, 2));
    let body = JSON.stringify({
      __logs__: [logs],
    });
    const url = `http://${config.project}.${config.host}/logstores/${config.logstore}/track`;
    this.xhr.open('POST', url, true);
    this.xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    this.xhr.setRequestHeader('x-log-apiversion', '0.6.0');
    this.xhr.setRequestHeader('x-log-bodyrawsize', body.length);
    this.xhr.onload = function () {
      if ((this.status >= 200 && this.status <= 300) || this.status == 304) {
        callback && callback();
      }
    };
    this.xhr.onerror = function (error) {
      console.log('error', error);
    };
    this.xhr.send(body);
  }
}

export default new SendTracker();
