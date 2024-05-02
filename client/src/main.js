import { createApp } from 'vue'
import App from './App.vue'
import { InstallCodemirro } from 'codemirror-editor-vue3';
import LoadScript from 'vue-plugin-load-script'
const app=createApp(App);
app.use(LoadScript);
app.use(InstallCodemirro,{componentName:'CodeMirror'});
app.mount('#app');