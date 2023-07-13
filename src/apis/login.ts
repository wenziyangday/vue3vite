import request from '@/utils/request';

export async function login(userName, password, code, uuid): Promise<T> {
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
export async function getCodeImg(): Promise<T> {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  });
}
