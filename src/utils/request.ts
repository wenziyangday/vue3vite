import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios';

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 1000,
  withCredentials: true
});

service.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    console.log(config, config.baseURL, '121232');
    return config;
  },
  async function (error: AxiosError) {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  function (response: AxiosResponse) {
    return response;
  },
  async function (error: AxiosError) {
    return Promise.reject(error);
  }
);

export default service;
