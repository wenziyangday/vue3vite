export const getItem = (key: string): any => {
  const val: string = localStorage.getItem(key);
  try {
    JSON.parse(val);
    return val;
  } catch (e) {
    return JSON.parse(val);
  }
};

export const setItem = (key: string, data: any): void => {
  let val: string = data;
  if (typeof data !== 'string') {
    val = JSON.stringify(data);
  }
  localStorage.setItem(key, val);
};

export const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};

export const clearStorage = (): void => {
  localStorage.clear();
};

export const getSItem = (key: string): any => {
  const val: string = sessionStorage.getItem(key);
  try {
    JSON.parse(val);
    return val;
  } catch (e) {
    return JSON.parse(val);
  }
};

export const setSItem = (key: string, data: any): void => {
  let val: string = data;
  if (typeof data !== 'string') {
    val = JSON.stringify(data);
  }
  sessionStorage.setItem(key, val);
};

export const removeSItem = (key: string): void => {
  sessionStorage.removeItem(key);
};

export const clearSStorage = (): void => {
  sessionStorage.clear();
};
