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
import VueApexCharts from 'vue-apexcharts';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

moment.locale('lt');
Vue.config.productionTip = false;

Vue.use(filters);
ApiService.init(`${process.env.VUE_APP_API_HOST}/api`);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
