import request from '@/utils/request';

// 查询字典数据列表
export function listData(query): Promise {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  });
}

// 查询字典数据详细
export function getData(dictCode: number | string): Promise {
  return request({
    url: `/system/dict/data/${dictCode}`,
    method: 'get'
  });
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType: string): Promise {
  return request({
    url: `/system/dict/data/type/${dictType}`,
    method: 'get'
  });
}

// 新增字典数据
export function addData(data): Promise {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data
  });
}

// 修改字典数据
export function updateData(data): Promise {
  return request({
    url: '/system/dict/data',
    method: 'put',
    data
  });
}

// 删除字典数据
export function delData(dictCode: string | number): Promise {
  return request({
    url: `/system/dict/data/${dictCode}`,
    method: 'delete'
  });
}
