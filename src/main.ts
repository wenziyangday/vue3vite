import 'ant-design-vue/dist/reset.css';
import '@/permission';

// import 'default-passive-events';
import * as Icons from '@ant-design/icons-vue';
import Antd from 'ant-design-vue';
import { createApp } from 'vue';

import App from '@/App.vue';
import myButton from '@/plugins/components/myButton';
import myDirective from '@/plugins/directives/myDirective';
import dictPlugin from '@/plugins/utils/dictPlugin';
import router from '@/router';
import { store } from '@/stores/store';

const app = createApp(App);

/** 注册全局组件 */
app.config.errorHandler = function (err, instance, info) {
  console.log(err, instance, info);
};

// 全局使用图标，遍历引入
const icons: any = Icons;
for (const i in icons) {
  app.component(i, icons[i]);
}

app
  .use(router)
  .use(store)
  .use(Antd)
  .use(myDirective)
  .use(myButton)
  .use(dictPlugin)
  .mount('#app');
