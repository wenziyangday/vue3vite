/**
 * 操作按钮类型 (枚举类型 相互映射)
 * */
export enum OptTypeEnum {
  'add',
  'edit',
  'delete',
  'detail',
  'export',
  'import',
  'resetPassword',
  'assignRoles'
}

export type OptType =
  | 'add'
  | 'edit'
  | 'delete'
  | 'detail'
  | 'export'
  | 'import'
  | 'resetPassword'
  | 'assignRoles';

export enum OptTypeCNEnum {
  '新增',
  '修改',
  '删除',
  '详情',
  '导出',
  '导入',
  '重置密码',
  '分配角色'
}

export type OptTypeCN =
  | '新增'
  | '修改'
  | '删除'
  | '详情'
  | '导出'
  | '导入'
  | '重置密码'
  | '分配角色';

/**
 * 搜索相关的类型
 * */
type InputType =
  | 'input'
  | 'inputPassword'
  | 'textarea'
  | 'select'
  | 'dateRangePicker'
  | 'datePicker'
  | 'treeSelect';

/**
 * @param {
 *   label: 'formItem label',
 *   name: 'formItem name',
 *   inputType: '输入框的类型',
 *   selectType: '下拉选择框的字典类别'
 * }
 * */
export interface IOptSearch {
  label?: string;
  name?: string;
  inputType?: InputType;
  selectType?: string;
}

interface IFieldNames {
  children: string;
  label: string;
  value: string;
}

export interface IFormItem {
  label?: string;
  name?: string;
  // 输入框类型
  inputType?: InputType;
  selectType?: string;
  // select Mode
  selectMode?: 'multiple' | 'tags' | 'combobox';
  colSpan?: number;
  // 树形选择器的数据值
  treeOptions?: unknown[];
  // 处理属性字段对应问题
  fieldNames?: IFieldNames;
}
