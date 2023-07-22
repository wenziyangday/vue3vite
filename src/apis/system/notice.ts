import request from '@/utils/request';

/**
 * 获取列表
 * */
export function listNotice(query): Promise {
  return request({
    url: '/system/notice/list',
    method: 'get',
    params: query
  });
}
