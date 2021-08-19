import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use({
    install(Vue) {
        Vue.prototype.chrome = chrome; // eslint-disable-line
    }
})

new Vue({
    render: h => h(App),
}).$mount('#app')