/**
 * 参数处理
 * @param {*} params  参数
 */
export function transformParams(params: any): string {
  let result = '';
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    const part = encodeURIComponent(propName) + '=';
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (
            value[key] !== null &&
            value[key] !== '' &&
            typeof value[key] !== 'undefined'
          ) {
            const paramsS = propName + '[' + key + ']';
            const subPart = encodeURIComponent(paramsS) + '=';
            result += subPart + encodeURIComponent(value[key]) + '&';
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&';
      }
    }
  }
  return result;
}

/**
 * 图片文件引入
 * @param {*} url  路径
 */
export function getAssetsUrl(url: string): string {
  return new URL(`../assets/${url}`, import.meta.url).href;
}

/**
 * 处理 listclass 转变为 color
 * @param {*} type 类型
 * */
export function colorListClass(type: string): string {
  const types = {
    success: '#67C23A',
    info: '#909399',
    warning: '#E6A23C',
    danger: '#F56C6C',
    primary: '#409EFF'
  };

  return types[type] ?? '#ff17ef';
}

/**
 * 生成随机数
 * */
export function randomStr(): string {
  return (Math.random() + +new Date()).toString(36).slice(0, 8);
}
