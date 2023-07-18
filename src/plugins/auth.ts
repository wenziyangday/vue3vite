import { store } from '@/stores/store';
import { useUser } from '@/stores/user';

const user = useUser(store);
// todo 此处会出现变量提升问题
const permissionInfo = [];

function authPermission(permission): boolean {
  const allPermission = '*:*:*';
  if (permission && permission.length > 0) {
    return permissionInfo.some((v) => {
      return allPermission === v || v === permission;
    });
  } else {
    return false;
  }
}

function authRole(role): boolean {
  const superAdmin = 'admin';
  const roles = user.roles;
  if (role && role.length > 0) {
    return roles.some((v) => {
      return superAdmin === v || v === role;
    });
  } else {
    return false;
  }
}

export default {
  // 验证用户是否具备某权限
  hasPermi(permission) {
    return authPermission(permission);
  },
  // 验证用户是否含有指定权限，只需包含其中一个
  hasPermiOr(permissions) {
    return permissions.some((item) => {
      return authPermission(item);
    });
  },
  // 验证用户是否含有指定权限，必须全部拥有
  hasPermiAnd(permissions) {
    return permissions.every((item) => {
      return authPermission(item);
    });
  },
  // 验证用户是否具备某角色
  hasRole(role) {
    return authRole(role);
  },
  // 验证用户是否含有指定角色，只需包含其中一个
  hasPermiOrhasRoleOr(roles) {
    return roles.some((item) => {
      return authRole(item);
    });
  },
  // 验证用户是否含有指定角色，必须全部拥有
  hasRoleAnd(roles) {
    return roles.every((item) => {
      return authRole(item);
    });
  }
};
