import { createApp } from 'vue'
import App from './App.vue'
import LoadScript from 'vue-plugin-load-script'
import "vue-picocss/css/pico.min.css"
const app=createApp(App);
app.use(LoadScript);app.mount('#app');