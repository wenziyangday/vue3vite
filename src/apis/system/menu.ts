import request from '@/utils/request';

// 查询菜单下拉树结构
export function treeSelect(): Promise {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  });
}
