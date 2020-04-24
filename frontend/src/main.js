import Vue from 'vue';
import App from './App.vue';
import * as moment from 'moment';

import router from './router';
import store from './store/index';
import './assets/scss/main.scss';

moment.locale('lt');

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
