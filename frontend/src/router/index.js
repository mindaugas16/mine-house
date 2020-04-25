import Vue from 'vue';
import Router from 'vue-router';
import App from '../App';
const RealEstates = () => import('../pages/RealEstates');

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: App,
      children: [{ path: '/', name: 'RealEstates', component: RealEstates }],
    },
  ],
  scrollBehavior() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // return { x: 0, y: 0 };
  },
});
