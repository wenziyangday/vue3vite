import { message, Modal, notification } from 'ant-design-vue';
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios';
import { saveAs } from 'file-saver';

import constants from '@/constants/constants';
import errorCode from '@/utils/errorCode';
import { getSItem, setSItem } from '@/utils/storeage';
import { getToken } from '@/utils/token';
import { blobValidate, transformParams } from '@/utils/tools';

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

    const { method, url, params, isTimeInclude } = config;
    let newParams = params;
    // ####begin 不够优雅
    if (isTimeInclude) {
      const oldParams = JSON.parse(JSON.stringify(params || {}));
      const filterKeys = Object.keys(oldParams).filter(
        (key) =>
          key.toLocaleLowerCase().includes('time') &&
          Array.isArray(oldParams[key]) &&
          oldParams[key].length === 2
      );

      const [key] = filterKeys;
      const [beginTime, endTime] = oldParams[key] || [];
      oldParams[key] = null;

      newParams = {
        ...oldParams,
        params: {
          beginTime: beginTime?.slice(0, 10),
          endTime: endTime?.slice(0, 10)
        }
      };
    }
    // #####end

    // get 请求需要拼装字符串
    if (method?.toLocaleLowerCase() === 'get' && params) {
      let uri: string = `${url ?? ''}?${transformParams(newParams)}`;
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

export function download(url, params, filename, config): Promise {
  // const downloadLoadingInstance = Loading.service({
  //   text: '正在下载数据，请稍候',
  //   spinner: 'el-icon-loading',
  //   background: 'rgba(0, 0, 0, 0.7)'
  // });
  return service
    .post(url, params, {
      transformRequest: [
        (params) => {
          return transformParams(params);
        }
      ],
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
      ...config
    })
    .then(async (data) => {
      const isBlob = blobValidate(data);
      if (isBlob) {
        const blob = new Blob([data]);
        saveAs(blob, filename);
      } else {
        const resText = await data.text();
        const rspObj = JSON.parse(resText);
        const errMsg =
          errorCode[rspObj.code] || rspObj.msg || errorCode.default;
        void message.error(errMsg);
      }
      // downloadLoadingInstance.close();
    })
    .catch((r) => {
      console.error(r);
      void message.error('下载文件出现错误，请联系管理员！');
      // downloadLoadingInstance.close();
    });
}

export default service;
