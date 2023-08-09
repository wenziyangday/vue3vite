import request from '@/utils/request';

// 查询菜单下拉树结构
export function treeSelect(): Promise {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  });
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId: string | number): Promise {
  return request({
    url: `/system/menu/roleMenuTreeselect/${roleId}`,
    method: 'get'
  });
}