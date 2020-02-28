import Vue from 'vue'
import App from './App.vue'

Vue.use({
    install(Vue) {
        Vue.prototype.chrome = chrome; // eslint-disable-line
    }
})

/* eslint-disable */
chrome.devtools.panels.create('MyPanel', 'img/icon.png', 'devtool.html', function () {
    // create success
});

new Vue({
    render: h => h(App),
}).$mount('#app')