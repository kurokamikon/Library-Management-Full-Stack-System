import { createApp } from 'vue';
import './style.css';
import 'primeicons/primeicons.css';
import App from './App.vue';
import router from './router';
import axiosPlugin from './utils/request';
import PrimeVue from 'primevue/config';
import Aura from '@/presets/lara';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import VConsole from 'vconsole';

const app = createApp(App);
if (process.env.NODE_ENV === 'development') {
  const vConsole = new VConsole();
}
app
  .use(router)
  .use(PrimeVue, {
    unstyled: true,
    pt: Aura
  })
  .use(axiosPlugin)
  .use(ToastService);
app.component('Toast', Toast);
router.isReady().then(() => app.mount('#app'));
