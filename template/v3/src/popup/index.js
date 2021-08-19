import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);

app.config.productionTip = false;
app.config.globalProperties.chrome = chrome; // eslint-disable-line

app.mount('#app');
