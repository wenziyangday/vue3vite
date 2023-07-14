import request from '@/utils/request';

export function login(userName, password, code, uuid): Promise {
  return request({
    url: '/auth/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: { userName, password, code, uuid }
  });
}

/**
 * 获取验证码
 * */
export function getCodeImg(): Promise {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  });
}
