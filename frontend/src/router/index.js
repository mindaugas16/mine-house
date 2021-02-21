import Vue from 'vue';
import Router from 'vue-router';

const Home = () => import('../pages/Home');
const RealEstates = () => import('../pages/RealEstates');
const RealEstate = () => import('../pages/RealEstate');

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/search/:id', name: 'RealEstates', component: RealEstates },
    {
      path: '/real-estate/:id',
      name: 'RealEstate',
      component: RealEstate,
    },
  ],
  mode: 'history',
  scrollBehavior() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
});
