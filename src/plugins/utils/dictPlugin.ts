import { type App, reactive } from 'vue';

import { getType } from '@/apis/dicts/dict';
import keyProvide from '@/constants/keyProvide';
import { download } from '@/utils/request';

/**
 * 全局的字典属性
 * */
export default {
  install(app: App) {
    const dictObjs = reactive<unknown>({});
    app.provide(keyProvide.$getDict, function (types: string[]): void {
      const promiseAll: Promise[] = [];
      // 减少不必要的重复的网络请求
      const newTypes: string[] = [];
      types.forEach((type) => {
        if (!dictObjs[type]) {
          newTypes.push(type);
          promiseAll.push(getType(type));
        }
      });

      void Promise.all(promiseAll).then((res) => {
        res.forEach((items, index) => {
          dictObjs[newTypes[index]] = items.data.map((item) => {
            return {
              label: item.dictLabel,
              value: item.dictValue,
              raw: item
            };
          });
        });
      });
    });
    app.provide(keyProvide.dictObjs, dictObjs);

    app.provide(keyProvide.$download, download);
  }
};
