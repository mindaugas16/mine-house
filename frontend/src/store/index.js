import Vue from 'vue';
import Vuex from 'vuex';
import realEstate from './modules/real-estate';
import crawler from './modules/crawler';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    realEstate,
    crawler,
  },
});
