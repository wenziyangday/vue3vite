import request from '@/utils/request';

/**
 * 获取路由
 * */
export function getRouters(): Promise {
  return request({
    url: '/getRouters',
    method: 'get'
  });
}