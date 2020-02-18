import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import { AxiosResponse } from 'axios';

Vue.use(Vuex);
const Persist = new VuexPersistence({
  key: 'rsv4-assignment',
  storage: window.localStorage,
});
export default new Vuex.Store({
  state: {
    token: '',
    refresh: '',
    tokenMeta: {},
    tokenPayload: {},
    isRefreshing: false,
    refreshPromise: undefined,
    showLoginError: false,
    showRegisterError: false,
  },
  mutations: {
    logout(state: any) {
      state.token = '';
      state.refresh = '';
      state.tokenMeta = {};
      state.tokenPayload = {};
      state.isRefreshing = false;
      state.refreshPromise = undefined;
      state.showLoginError = false;
      state.showRegisterError = false;
    },
    setAuthToken(state: any, newToken: string): void {
      state.token = newToken;
      const tokenSplit = newToken.split('.');
      state.tokenMeta = JSON.parse(atob(tokenSplit[0]));
      state.tokenPayload = JSON.parse(atob(tokenSplit[1]));
    },
    setRefreshToken(state: any, newToken: string): void {
      state.refresh = newToken;
    },
    setRefreshChain(state: any, promise: Promise<AxiosResponse>) {
      state.isRefreshing = true;
      state.refreshPromise = promise;
    },
    clearRefresh(state: any) {
      state.isRefreshing = false;
      state.refreshPromise = undefined;
    },
    showLoginError(state: any, show: boolean) {
      state.showLoginError = show;
    },
    showRegisterError(state: any, show: boolean) {
      state.showRegisterError = show;
    },
  },
  actions: {
  },
  modules: {
  },
  plugins: [Persist.plugin],
});
