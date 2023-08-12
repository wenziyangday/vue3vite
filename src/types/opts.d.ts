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
  'assignRoles',
  'dataRights',
  'assignUsers'
}

export type OptType =
  | 'add'
  | 'edit'
  | 'delete'
  | 'detail'
  | 'export'
  | 'import'
  | 'resetPassword'
  | 'assignRoles'
  | 'dataRights'
  | 'assignUsers';

export enum OptTypeCNEnum {
  '新增',
  '修改',
  '删除',
  '详情',
  '导出',
  '导入',
  '重置密码',
  '分配角色',
  '数据权限',
  '分配用户'
}

export type OptTypeCN =
  | '新增'
  | '修改'
  | '删除'
  | '详情'
  | '导出'
  | '导入'
  | '重置密码'
  | '分配角色'
  | '数据权限'
  | '分配用户';

/**
 * 搜索相关的类型
 * */
type InputType =
  | 'input'
  | 'inputPassword'
  | 'inputNumber'
  | 'textarea'
  | 'radio'
  | 'select'
  | 'dateRangePicker'
  | 'datePicker'
  | 'treeSelect'
  | 'treeCheck';

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
  treeOptions?: Array<Record<string, unknown>>;
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
  // 等分
  bisection?: 1 | 2;
  // 树形选择器的数据值
  treeOptions?: unknown[];
  // 处理属性字段对应问题
  fieldNames?: IFieldNames;
  // 允许操作与否
  disabled?: boolean;
  // 关联显示控制器（前面是字段，后面是值）[a, 2] vif=a===2
  relationShow: string[];
  // 默认值
  defaultValue?: unknown;
}
