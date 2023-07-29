/**
 * @description 全局注册方法常量
 * */

export default {
  // 获取dict 数据
  $getDict: Symbol('getDict'),
  // dict变量
  dictObjs: Symbol('dictObjs'),
  // 表单校验函数
  $formValidate: Symbol('validate'),
  // 表单重置方法
  $formReset: Symbol('reset'),
  // 表单数据
  formStatus: Symbol('formStatus')
};
