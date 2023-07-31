import request from '@/utils/request';

// 查询角色列表
export function listRole(query): Promise {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: query,
    isTimeInclude: true
  });
}

// 查询角色详细
export function getRole(roleId: string | number): Promise {
  return request({
    url: `/system/role/${roleId}`,
    method: 'get'
  });
}

// 新增角色
export function addRole(data): Promise {
  return request({
    url: '/system/role',
    method: 'post',
    data
  });
}

// 修改角色
export function updateRole(data): Promise {
  return request({
    url: '/system/role',
    method: 'put',
    data
  });
}

// 角色数据权限
export function dataScope(data): Promise {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data
  });
}

// 角色状态修改
export function changeRoleStatus(roleId, status): Promise {
  const data = {
    roleId,
    status
  };
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data
  });
}

// 删除角色
export function delRole(roleId: string | number): Promise {
  return request({
    url: `/system/role/${roleId}`,
    method: 'delete'
  });
}

// 查询角色已授权用户列表
export function allocatedUserList(query): Promise {
  return request({
    url: '/system/role/authUser/allocatedList',
    method: 'get',
    params: query
  });
}

// 查询角色未授权用户列表
export function unallocatedUserList(query): Promise {
  return request({
    url: '/system/role/authUser/unallocatedList',
    method: 'get',
    params: query
  });
}

// 取消用户授权角色
export function authUserCancel(data): Promise {
  return request({
    url: '/system/role/authUser/cancel',
    method: 'put',
    data
  });
}

// 批量取消用户授权角色
export function authUserCancelAll(data): Promise {
  return request({
    url: '/system/role/authUser/cancelAll',
    method: 'put',
    params: data
  });
}

// 授权用户选择
export function authUserSelectAll(data): Promise {
  return request({
    url: '/system/role/authUser/selectAll',
    method: 'put',
    params: data
  });
}

// 根据角色ID查询部门树结构
export function deptTreeSelect(roleId: number | string): Promise {
  return request({
    url: `/system/role/deptTree/${roleId}`,
    method: 'get'
  });
}
