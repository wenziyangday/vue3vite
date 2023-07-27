/**
 * 操作按钮类型
 * */
export type OptType =
  | 'add'
  | 'edit'
  | 'delete'
  | 'detail'
  | 'export'
  | 'import'
  | 'resetPassword'
  | 'assignRoles';

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
type InputType = 'input' | 'select' | 'dateRangePicker' | 'datePicker';

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
