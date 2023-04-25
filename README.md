# ch-monitor

1. options

```js

{
  config: {
    host: '',// 阿里云日志平台域名
    project: '',// 日志平台项目名称
    logstore: ''// 日志仓库名称
  },
  monitorResourceErr: true,
  monitorJsErr: true,
  monitorPromiseErr: true,
  monitorBlankScreenErr: true,
  monitorXHRErr: true,

  monitorLongTask: true,
  longTaskTime: 100,// 多长的时间才算是长任务

  monitorPermanceFirstInput: true,// 首次加载时间
  monitorPermancePain: true,// 绘制时间
  monitorLoadTime: true,// 加载时间
}

```

2. 支持用户自定义上传日志

- 向外暴露 tracker 对象
