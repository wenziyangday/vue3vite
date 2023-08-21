import request from '@/utils/request';

// 获取服务信息
export function getServer(): Promise {
  return request({
    url: '/monitor/server',
    method: 'get'
  });
}
