import 'ant-design-vue/dist/reset.css';
import '@/permission';

import Antd from 'ant-design-vue';
import { createApp } from 'vue';

import App from '@/App.vue';
import MyBtn from '@/components/MyButton.vue';
import router from '@/router';
import { store } from '@/stores/store';

const app = createApp(App);

/** 注册全局组件 */
app.component('my-btn', MyBtn);

/** 注册全局组件 */
app.config.errorHandler = function (err, instance, info) {
  console.log(err, instance, info);
};

app.use(router).use(store).use(Antd).mount('#app');
