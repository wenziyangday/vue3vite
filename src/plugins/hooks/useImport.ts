import { ref } from 'vue';

import constants from '@/constants/constants';
import { getToken } from '@/utils/token';

/**
 * 导入参数
 * */
const useImport = function (): Record<string, unknown> {
  const uploadParams = ref<Record<string, unknown>>({
    isOpen: false,
    // 是否禁用上传
    isUploading: false,
    // 是否更新已经存在的用户数据
    updateSupport: 0,
    // 设置上传的请求头部
    headers: { Authorization: `${constants.tokenPrefix} ${getToken()}` },
    // 上传的地址
    url: `${import.meta.env.VITE_APP_BASE_API}/system/user/importData`
  });
  return uploadParams;
};

export default useImport;
