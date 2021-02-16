import Vue from 'vue';
import App from './App.vue';
import * as moment from 'moment';

import router from './router';
import store from './store/index';
import filters from './filters';
import BootstrapVue from 'bootstrap-vue';
import ApiService from './services/api.service';
import './assets/scss/main.scss';
import './registerServiceWorker';

import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);

moment.locale('lt');
Vue.config.productionTip = false;

Vue.use(filters);

ApiService.init(`${process.env.VUE_APP_API_HOST}:${process.env.APP_SERVER_PORT}/api`);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
