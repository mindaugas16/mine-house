import highlight from './highlight';
import join from './join';

export default {
  install(Vue) {
    Vue.filter('highlight', highlight);
    Vue.filter('join', join);
  },
};
