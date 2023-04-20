export function injectJsError() {
  window.addEventListener('error', (event) => {
    console.log('event = ', event);
    const log = {
      // 监控指标大类
      kind: 'stability',
      // 小类型
      type: 'error',
      // js执行错误
      errorType: 'jsError',
      // 访问路径
      url: '',
      // 报错信息
      message: event.message,
      // 哪个文件
    };
  });
}
