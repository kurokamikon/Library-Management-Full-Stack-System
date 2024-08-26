import { createApp } from 'vue';
import './style.css';
import 'primeicons/primeicons.css';
import App from './App.vue';
import router from './router';
import axiosPlugin from './utils/request';
import PrimeVue from 'primevue/config';
import Aura from './presets/lara';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import VConsole from 'vconsole';
import { state, userMethods } from './store/userState';
const app = createApp(App);
if (process.env.NODE_ENV === 'development') {
  const vConsole = new VConsole();
}
app
  .use(router)
  .use(PrimeVue, { unstyled: true, pt: Aura })
  .use(axiosPlugin)
  .use(ToastService)
  .use(ConfirmationService)
  .provide('router', router)
  .component('Toast', Toast)
  .mixin({
    data: () => ({ globalUser: state }),
    methods: { ...userMethods }
  });
router.isReady().then(() => app.mount('#app'));
