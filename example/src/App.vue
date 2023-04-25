<template>
  <nav>
    <router-link to="/">Home</router-link>
    |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view />
</template>
<script setup>
import axios from 'axios';
console.log('========');
// js语法错误 vue会吞掉
// console.log(a.b());
// promise 错误 vue不会吞掉
// new Promise((resolve, reject) => {
//   throw new Error('promise error!!!');
// });

// axios.get('http://localhost/');
</script>
<style></style>
