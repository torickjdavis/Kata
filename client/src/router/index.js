import Vue from 'vue';
import VueRouter from 'vue-router';

import Explore from '@/views/Explore.vue';
import Editor from '@/views/Editor.vue';
import Authentication from '@/views/Authentication.vue';

import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/explore',
    name: 'Explore',
    component: Explore,
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor,
  },
  {
    path: '/authentication',
    name: 'Authentication',
    component: Authentication,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
