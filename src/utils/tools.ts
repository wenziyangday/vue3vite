import dayjs from 'dayjs';

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

// 验证是否为blob格式
export function blobValidate(data): boolean {
  return data.type !== 'application/json';
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(
  data,
  id,
  parentId,
  children
): Array<Record<string, unknown>> {
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  };

  const childrenListMap = {};
  const nodeIds = {};
  const tree = [];

  for (const d of data) {
    const parentId = d[config.parentId];
    if (!childrenListMap[parentId]) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId]?.push(d);
  }

  for (const d of data) {
    const parentId = d[config.parentId];

    if (!nodeIds[parentId]) {
      tree.push(d);
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o): void {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }

  return tree;
}

export function parseTime(date, format: string = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format);
}
