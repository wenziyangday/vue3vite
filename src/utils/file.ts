import axios from 'axios';

import constants from '@/constants/constants';

/**
 * 获取iconfont 字典
 * */
export const getIcons = (): Promise => {
  return axios.get(constants.iconFontJsUrl);
};
