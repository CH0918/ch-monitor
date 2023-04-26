<template>
  <div class="home">
    <h1>测试js错误</h1>
    <button @click="jsErr">上报js语法错误</button>
    <h1>测试promise错误</h1>
    <button @click="promiseErr">上报promise错误</button>
    <h1>上报ajax错误</h1>
    <button @click="ajaxErr">上报ajax错误</button>
    <h1>上报白屏错误</h1>
    <button @click="blankErr">上报白屏错误</button>
    <h1>上报长任务错误</h1>
    <button @click="longTaskErr">长任务报错</button>
    <h1>上报性能相关信息</h1>
    <button @click="reloadPage">刷新页面</button>
  </div>
</template>

<script setup>
import axios from 'axios';
const jsErr = () => {
  console.log(aaa.ee());
};
const promiseErr = () => {
  new Promise((resolve, reject) => {
    throw new Error('promise err');
  });
};
const ajaxErr = () => {
  axios.get('http://local');
};

const blankErr = () => {
  document.body.innerHTML = '';
  ajaxErr();
};
const longTaskErr = () => {
  const now = Date.now();
  while (Date.now() - now < 200) {}
  console.log('longTask run');
};
const reloadPage = () => {
  location.reload();
};
</script>
