import request from '@/utils/request';

// 查询用户列表
export function listUser(query): Promise {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  });
}

// 查询用户详细
export function getUser(userId: string | number): Promise {
  return request({
    url: `/system/user/${userId}`,
    method: 'get'
  });
}

// 新增用户
export function addUser(data): Promise {
  return request({
    url: '/system/user',
    method: 'post',
    data
  });
}

// 修改用户
export function updateUser(data): Promise {
  return request({
    url: '/system/user',
    method: 'put',
    data
  });
}

// 删除用户
export function delUser(userId: string | number): Promise {
  return request({
    url: `/system/user/${userId}`,
    method: 'delete'
  });
}

// 用户密码重置
export function resetUserPwd(userId, password): Promise {
  const data = {
    userId,
    password
  };
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data
  });
}

// 用户状态修改
export function changeUserStatus(userId, status): Promise {
  const data = {
    userId,
    status
  };
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data
  });
}

// 查询用户个人信息
export function getUserProfile(): Promise {
  return request({
    url: '/system/user/profile',
    method: 'get'
  });
}

// 修改用户个人信息
export function updateUserProfile(data): Promise {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data
  });
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword): Promise {
  const data = {
    oldPassword,
    newPassword
  };
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  });
}

// 用户头像上传
export function uploadAvatar(data): Promise {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data
  });
}

// 查询授权角色
export function getAuthRole(userId: string | number): Promise {
  return request({
    url: `/system/user/authRole/${userId}`,
    method: 'get'
  });
}

// 保存授权角色
export function updateAuthRole(data): Promise {
  return request({
    url: '/system/user/authRole',
    method: 'put',
    params: data
  });
}

// 查询部门下拉树结构
export function deptTreeSelect(): Promise {
  return request({
    url: '/system/user/deptTree',
    method: 'get'
  });
}
