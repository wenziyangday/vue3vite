import constants from '@/constants/constants';
import { getItem, getSItem, removeItem, removeSItem } from '@/utils/storeage';

export const getToken = (): string => {
  return getItem(constants.token);
};

export const removeToken = (): void => {
  removeItem(constants.token);
};

export const getSToken = (): string => {
  return getSItem(constants.token);
};

export const removeSToken = (): void => {
  removeSItem(constants.token);
};
