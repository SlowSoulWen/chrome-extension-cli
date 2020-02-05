<template>
  <div id="app">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your popup"/>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'app',
  mounted() {
    // 设置badge
    this.chrome.browserAction.setBadgeText({text: 'demo'});
    this.chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
  },
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  width: 400px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>