import Vue from 'vue';
import VueRouter from 'vue-router';
import Explore from '@/views/Explore.vue';
import Workshops from '@/views/Workshops.vue';
import Authentication from '@/views/Authentication.vue';
import Account from '@/views/Account.vue';
import Submission from '@/views/Submission.vue';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/explore',
    name: 'Explore',
    component: Explore,
  },
  {
    path: '/workshops',
    name: 'Workshops',
    component: Workshops,
  },
  {
    path: '/authentication',
    name: 'Authentication',
    component: Authentication,
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
  },
  {
    path: '/submission/:id/:submissionId',
    name: 'Submission',
    component: Submission,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },

  {
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
});

export default router;
