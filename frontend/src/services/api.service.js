import axios from 'axios';

export default {
  init(baseURL) {
    axios.defaults.baseURL = baseURL;
  },
  get(path, params) {
    return axios.get(path, { params });
  },
  patch(path, payload) {
    return axios.patch(path, payload);
  },
  post(path, payload) {
    return axios.post(path, payload);
  },
  put(path, payload) {
    return axios.put(path, payload);
  },
  delete(path) {
    return axios.delete(path);
  },
};
