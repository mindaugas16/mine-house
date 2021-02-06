import Vue from 'vue';
import App from './App.vue';
import * as moment from 'moment';

import router from './router';
import store from './store/index';
import filters from './filters';
import './assets/scss/main.scss';
import './registerServiceWorker';
import ApiService from './services/api.service';

moment.locale('lt');
Vue.config.productionTip = false;

Vue.use(filters);
ApiService.init(`${process.env.VUE_APP_API_HOST}/api`);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
