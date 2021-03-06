import Vue from 'vue';
import Vuex from 'vuex';
import * as auth from '../services/AuthService';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userId: null,
    name: null,
    token: null,
    isLoggedIn: false,
    cliBase: 'kata-cli',
    apiUrl: process.env.VUE_APP_API_URL,
  },
  mutations: {
    authenticate(state) {
      state.isLoggedIn = auth.isLoggedIn();
      state.token = localStorage.getItem('token');
      if (state.isLoggedIn) {
        state.name = auth.getName();
        state.userId = auth.getUserId();
      } else {
        state.userId = null;
        state.name = null;
      }
    },
  },
  actions: {
    authenticate(context) {
      context.commit('authenticate');
    },
  },
  modules: {},
});
