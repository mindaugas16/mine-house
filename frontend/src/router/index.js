import Vue from 'vue';
import Router from 'vue-router';
import App from '../App';
import RealEstates from '../pages/RealEstates';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: App,
      children: [{ path: '/', name: 'RealEstates', component: RealEstates }],
    },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});
