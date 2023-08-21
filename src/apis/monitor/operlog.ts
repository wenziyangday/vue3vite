import request from '@/utils/request';

// 查询操作日志列表
export function listLog(query): Promise {
  return request({
    url: '/monitor/operlog/list',
    method: 'get',
    params: query
  });
}

// 删除操作日志
export function delOperlog(operId: string | number): Promise {
  return request({
    url: `/monitor/operlog/${operId}`,
    method: 'delete'
  });
}

// 清空操作日志
export function cleanOperlog(): Promise {
  return request({
    url: '/monitor/operlog/clean',
    method: 'delete'
  });
}
