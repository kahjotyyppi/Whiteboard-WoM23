import { createApp } from 'vue'
import App from './App.vue'
import BootstrapVueNext from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import store from './store';


const app = createApp(App);
app.use(BootstrapVueNext);
app.use(store);
app.mount('#app');
