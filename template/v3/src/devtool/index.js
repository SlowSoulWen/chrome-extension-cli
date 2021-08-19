import { createApp } from 'vue'
import App from './App.vue'

/* eslint-disable */
chrome.devtools.panels.create('MyPanel', 'img/icon.png', 'devtool.html', function () {
    // create success
});

const app = createApp(App);

app.config.globalProperties.chrome = chrome; // eslint-disable-line

app.mount('#app');
