import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import store from '@/store/index';

type AxiosRequestCallback = () => Promise<AxiosResponse>;

function refreshToken(callback: AxiosRequestCallback): Promise<AxiosResponse> {
  if (store.state.isRefreshing) {
    const promise = store.state.refreshPromise.then(callback);
    store.commit('setRefreshChain', promise);
    return promise;
  }
  const promise = Axios.get(`/api/login/refresh-token/${store.state.refresh}`).then((res: AxiosResponse) => {
    const response = res.data;
    store.commit('setAuthToken', response.data.token);
    if (response.data.refresh) {
      store.commit('setRefreshToken', response.data.refresh);
    }
    store.commit('clearRefresh');
    return Promise.resolve(response.data.token);
  }).then(callback);
  store.commit('setRefreshChain', promise);
  return promise;
}

Axios.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
  const retConf = config;
  if (retConf.method !== 'get' && retConf.method !== 'GET') {
    retConf.headers['Content-Type'] = 'application/json';
  }

  if (store.state.token !== '') {
    retConf.headers.Authorization = `Bearer ${store.state.token}`;
  }
  return retConf;
});

Axios.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: any): any => {
    const err = error;
    const status = err.response ? err.response.status : null;
    if (status
      && status === 401
      && store.state.refresh !== ''
      && err.config.url
      && err.config.url.indexOf('refresh-token') === -1) {
      return refreshToken(() => {
        err.config.headers.Authorization = `Bearer ${store.state.token}`;
        err.config.baseURL = undefined;
        return Axios.request(error.config);
      });
    }
    return Promise.reject(error);
  },
);
