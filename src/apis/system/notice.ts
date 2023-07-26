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

// 新增公告
export function addNotice(data): Promise {
  return request({
    url: '/system/notice',
    method: 'post',
    data
  });
}

// 修改公告
export function updateNotice(data): Promise {
  return request({
    url: '/system/notice',
    method: 'put',
    data
  });
}

// 删除公告
export function delNotice(noticeId: string | number): Promise {
  return request({
    url: `/system/notice/${noticeId}`,
    method: 'delete'
  });
}
