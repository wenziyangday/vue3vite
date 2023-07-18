import request from '@/utils/request';

export function login(
  userName: string,
  password: string,
  code: string,
  uuid: string
): Promise {
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

/**
 * 获取用户详细信息
 * */
export function getInfo(): Promise {
  return request({
    url: '/system/user/getInfo',
    method: 'get'
  });
}

/**
 * 退出方法
 * */
export function logout(): Promise {
  return request({
    url: '/auth/logout',
    method: 'delete'
  });
}
