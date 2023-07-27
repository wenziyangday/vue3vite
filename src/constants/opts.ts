/**
 * 操作常量
 * */
import { type OptType, type OptTypeCN } from '@/types/opts';

/**
 * @param {
 *   type: '操作按钮类型',
 *   label: '操作按钮的标题',
 *   icon: '操作按钮的图标'
 * }
 * */
interface IOpt {
  type: OptType;
  label: OptTypeCN;
  icon: string;
}

export const opts: IOpt[] = [
  {
    type: 'add',
    label: '新增',
    icon: 'plus-outlined'
  },
  {
    type: 'edit',
    label: '修改',
    icon: 'edit-outlined'
  },
  {
    type: 'delete',
    label: '删除',
    icon: 'delete-outlined'
  },
  {
    type: 'detail',
    label: '详情',
    icon: 'file-done-outlined'
  },
  {
    type: 'export',
    label: '导出',
    icon: 'export-outlined'
  },
  {
    type: 'import',
    label: '导入',
    icon: 'import-outlined'
  },
  {
    type: 'resetPassword',
    label: '重置密码',
    icon: 'key-outlined'
  },
  {
    type: 'assignRoles',
    label: '分配角色',
    icon: 'sisternode-outlined'
  }
];
