import request from '@/utils/request';

// 查询登录日志列表
export function listLoginInfo(query): Promise {
  return request({
    url: '/monitor/logininfor/list',
    method: 'get',
    params: query,
    isTimeInclude: true
  });
}

// 删除登录日志
export function delLoginInfo(infoId: string | number): Promise {
  return request({
    url: `/monitor/logininfor/${infoId}`,
    method: 'delete'
  });
}

// 解锁用户登录状态
export function unlockLoginInfo(userName: string): Promise {
  return request({
    url: `/monitor/logininfor/unlock/${userName}`,
    method: 'get'
  });
}

// 清空登录日志
export function cleanLoginInfo(): Promise {
  return request({
    url: '/monitor/logininfor/clean',
    method: 'delete'
  });
}
