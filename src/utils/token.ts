import constants from '@/constants/constants';
import {
  getItem,
  getSItem,
  removeItem,
  removeSItem,
  setItem,
  setSItem
} from '@/utils/storeage';

export const getToken = (): string => {
  return getItem(constants.token);
};

export const setToken = (val: string): string => {
  setItem(constants.token, val);
};

export const removeToken = (): void => {
  removeItem(constants.token);
};

export const getSToken = (): string => {
  return getSItem(constants.token);
};

export const setSToken = (val: string): string => {
  setSItem(constants.token, val);
};

export const removeSToken = (): void => {
  removeSItem(constants.token);
};
