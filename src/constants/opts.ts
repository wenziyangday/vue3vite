/**
 * 操作常量
 * 操作类型
 * */
export type OptType =
  | 'add'
  | 'edit'
  | 'delete'
  | 'detail'
  | 'export'
  | 'import';

export type OptTypeCN = '新增' | '修改' | '删除' | '详情' | '导出' | '导入';

interface IOpt {
  type: OptType;
  label: OptTypeCN;
  icon: string;
}

const opts: IOpt[] = [
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
  }
];

export default opts;
