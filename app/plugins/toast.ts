import Vue3Toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 5000,
    rtl: true,
    position: 'bottom-left',
    toastClassName: 'toast-custom',
  });
  return {
    provide: { toast },
  };
});
