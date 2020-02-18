import '@/http';
import Vue from 'vue';
import AuthModal from '@/components/Auth/auth-modal.vue';
import '@mdi/font/scss/materialdesignicons.scss';
import '@/assets/main.scss';
import router from './router';
import store from './store';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.component('auth-modal', AuthModal);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
