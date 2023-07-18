import { message, Modal, notification } from 'ant-design-vue';
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios';

import constants from '@/constants/constants';
import errorCode from '@/utils/errorCode';
import { getSItem, setSItem } from '@/utils/storeage';
import { getToken } from '@/utils/token';
import { transformParams } from '@/utils/tools';

export const isReLogin = { show: false };

axios.defaults.headers['content-type'] = 'application/json;charset=utf-8';
const service: AxiosInstance = axios.create({
  // base url
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时时间
  timeout: 1000,
  // 跨域 请求时是否需要使用凭证
  withCredentials: true
});

service.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    // 是否需要设置 token
    const isToken = config.headers?.isToken === false;
    // 是否需要防止数据重复提交
    const isRepeatSubmit = config.headers?.repeatSubmit === false;

    if (getToken() && !isToken) {
      // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers.Authorization = `${constants.tokenPrefix} ${getToken()}`;
    }

    const { method, url, params } = config;

    // get 请求需要拼装字符串
    if (method?.toLocaleLowerCase() === 'get' && params) {
      let uri: string = `${url ?? ''}?${transformParams(params)}`;
      uri = uri.slice(0, -1);
      config.params = {};
      config.url = uri;
    }

    // 重复提交
    if (
      !isRepeatSubmit &&
      (method?.toLocaleLowerCase() === 'post' ||
        method?.toLocaleLowerCase() === 'put')
    ) {
      const requestObj = {
        url: config.url,
        data:
          typeof config.data === 'object'
            ? JSON.stringify(config.data)
            : config.data,
        time: +new Date()
      };

      const requestObjFromSession = getSItem(constants.repeatSubmit);

      if (!requestObjFromSession) {
        setSItem(constants.repeatSubmit, requestObj);
      } else {
        const sUrl: string = requestObjFromSession.url; // 请求地址
        const sData = requestObjFromSession.data; // 请求数据
        const sTime = requestObjFromSession.time; // 请求时间
        const interval = 1000; // 间隔时间
        if (
          sUrl === requestObj.url &&
          sData === requestObj.data &&
          requestObj.time - sTime < interval
        ) {
          const msg = '数据正在处理，请勿重复提交';
          console.warn(`[${sUrl ?? ''}]: ${msg}`);
          return Promise.reject(new Error(msg));
        } else {
          setSItem(constants.repeatSubmit, requestObj);
        }
      }
    }
    return config;
  },
  function (error: AxiosError) {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  function (response: AxiosResponse) {
    // 未设置状态码则默认成功状态
    const code = response.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || response.data.msg || errorCode.defaultCode;
    // 二进制数据则直接返回
    if (
      response.request.responseType === 'blob' ||
      response.request.responseType === 'arraybuffer'
    ) {
      return response.data;
    }

    if (code === 401) {
      if (!isReLogin.show) {
        isReLogin.show = true;

        Modal.confirm({
          title: '系统提示',
          content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
          cancelText: '取消',
          okText: '确定',
          centered: true,
          onOk() {
            isReLogin.show = false;
            // store.dispatch('LogOut').then(() => {
            //   location.href = '/index';
            // });
          },
          onCancel() {
            isReLogin.show = false;
          }
        });
      }
      return Promise.reject(
        new Error('无效的会话，或者会话已过期，请重新登录。')
      );
    } else if (code === 500) {
      void message.error(msg);
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      notification.error({
        message: msg
      });
      return Promise.reject(new Error('error'));
    } else {
      return response.data;
    }
  },
  function (error: AxiosError) {
    let { message: msg } = error;
    if (msg === 'Network Error') {
      msg = '后端接口连接异常';
    } else if (msg.includes('timeout')) {
      msg = '系统接口请求超时';
    } else if (msg.includes('Request failed with status code')) {
      msg = '系统接口' + msg.substr(msg.length - 3) + '异常';
    }
    void message.error(msg);
    return Promise.reject(error);
  }
);

export default service;
