export default function checkConfig(config) {
  if (!config || !config.project || !config.host || !config.logstore) {
    console.error('参数host, project, logstore为上传阿里云日志库的必填参数');
    return;
  }
  return true;
}
