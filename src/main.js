import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import axiosPlugin from './utils/request';
import PrimeVue from 'primevue/config';
import Aura from '@/presets/lara';
import ToastService from 'primevue/toastservice';

const app = createApp(App);
app
  .use(router)
  .use(PrimeVue, {
    unstyled: true,
    pt: Aura
  })
  .use(axiosPlugin)
  .use(ToastService);
router.isReady().then(() => app.mount('#app'));
