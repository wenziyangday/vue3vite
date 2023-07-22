// 查询字典类型详细
import request from '@/utils/request';

/**
 * 根据类型获取字典中的数据
 * */
export function getType(dictId: string): Promise {
  return request({
    url: `/system/dict/data/type/${dictId}`,
    method: 'get'
  });
}
