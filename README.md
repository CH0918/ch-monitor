# 前端监控 sdk

监控前端报错，将报错信息上报到阿里云日志系统，方便快速排查问题；收集前端性能相关的数据，针对性优化。目前只是快速把功能实现了，还有很大的优化空间。

1. 支持监控以下类型异常

- 一般的 js 错误
- 资源加载错误
- 调用接口错误
- 页面白屏

2. 支持监控性能相关指标

- 页面加载时间
- 页面 FP、FCP、FMP、LCP、FID 等时间
- 长任务

3. 支持自定义埋点数据上报

## 安装

```shell
npm install @ch0918/monitor
```

## vue3 中使用

```js
import { createApp } from 'vue';
import { ChMonitor } from '@ch0918/monitor';

const app = createApp();
const monitor = new ChMonitor({
  config: {
    // 阿里云日志系统域名
    host: '',
    // 阿里云日志系统项目名
    project: '',
    // 阿里云日志系统仓库名
    logstore: '',
  },
});
app.use(monitor);
```

## vue2 中使用

```js
import Vue from 'vue';
import { ChMonitor } from '@ch0918/monitor';

const monitor = new ChMonitor({
  config: {
    // 阿里云日志系统域名
    host: '',
    // 阿里云日志系统项目名
    project: '',
    // 阿里云日志系统仓库名
    logstore: '',
  },
});
Vue.use();
```

## 通过 cdn 使用

```html
<script src="https://www.unpkg.com/browse/@ch0918/monitor@1.0.2/dist/ch-monitor.umd.js"></script>
<!-- 暴露了ChMonitor全局对象 -->
<!-- const {ChMitor, send, monitorBlankScreen} = ChMonitor;
用法跟Vue2和Vue3中一样 -->
```

## 阿里云日志系统

由于本 SDK 主要是将采集到的数据上传到阿里云日志系统中，所以需要先开通阿里云日志服务，方法如下：

1. 登录阿里云平台选择日志服务
   [阿里云日志服务](https://sls.console.aliyun.com/)
   ![选择日志服务](https://cdn.jsdelivr.net/gh/CH0918/Image/images/20230426155535.png)
2. 创建项目，调用 sdk 配置需要的 project 字段
   ![创建项目](https://cdn.jsdelivr.net/gh/CH0918/Image/images/20230426155737.png)
3. 创建 logstore，调用 sdk 配置需要的 logstore 字段
   ![创建logstore](https://cdn.jsdelivr.net/gh/CH0918/Image/images/20230426160122.png)
4. 创建成功
   ![仓库](https://cdn.jsdelivr.net/gh/CH0918/Image/images/20230426160412.png)
5. 调用 sdk 诶之需要的 host 字段
   ![host](https://cdn.jsdelivr.net/gh/CH0918/Image/images/20230426160412.png)

## 配置项

| 名称                        | 字段类型                   | 默认         | 描述                                                                        |
| :-------------------------- | :------------------------- | :----------- | :-------------------------------------------------------------------------- |
| `config.host `              | `string`                   | `undefined`  | 阿里云日志服务域名，详见上面说明                                            |
| `config.project `           | `string `                  | `undefined ` | 阿里云日志服务项目名，详见上面说明                                          |
| `config.logstore`           | `string`                   | `undefined`  | 阿里云日志服务仓库名，详见上面说明                                          |
| `monitorJsErr  `            | `boolean`                  | `true `      | 是否监控普通的 js 错误                                                      |
| `monitorResourceErr`        | `boolean`                  | `true`       | 是否监控资源加载类型错误                                                    |
| `monitorPromiseErr `        | ` boolean`                 | `true `      | 是否监控 promise 类型错误                                                   |
| `monitorBlankScreenErr`     | `boolean `                 | `true `      | 是否监控白屏                                                                |
| `monitorXHRErr`             | `boolean`                  | ` true`      | 是否监控接口报错                                                            |
| `monitorLongTask`           | `boolean`                  | `true `      | 是否监控长任务                                                              |
| `longTaskTime`              | `number`                   | `100 毫秒`   | 定义长任务的时间                                                            |
| `monitorPermanceFirstInput` | `boolean`                  | `true`       | 是否监控首次可交互时间指标                                                  |
| `monitorPermancePain`       | `boolean`                  | `true`       | 是否监控绘制时间指标                                                        |
| ` monitorLoadTime`          | `boolean`                  | `true`       | 是否监控加载时间指标                                                        |
| `send`                      | `function(data, callback)` | -            | 手动上传数据，data.config 的 project,host,logstore 三个参数必传             |
| `monitorBlankScreen`        | `function(data)`           | -            | 在需要的地方手动监控白屏，data.config 的 project,host,logstore 三个参数必传 |

```js
// 举个例子
import { send, monitorBlankScreen, ChMonitor } from '@ch0918/monitor';

const config = { host: 'xxx', project: 'xxx', logstore: 'xxx' };
const monitor = new ChMonitor({
  config,
});
// 手动调方法上传日志
send(
  {
    config,
    uid: 1,
    token: 'abc',
  },
  () => {
    console.log('send success');
  }
);
// 在需要的地方开启白屏监控
monitorBlankScreen({ config });
```

## TODO

- [x] 基本的数据采集功能
- [ ] 改成 TypeScript 重写
- [ ] 添加单元测试
- [ ] 新增 server 服务，将采集到的数据上传到数据库中
- [ ] 新增后台看板功能
