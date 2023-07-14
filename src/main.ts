import 'ant-design-vue/dist/antd.css';

import Antd from 'ant-design-vue';
import { createApp } from 'vue';

import App from '@/App.vue';
import MyBtn from '@/components/MyButton.vue';
import router from '@/router';

const app = createApp(App);

/** 注册全局组件 */
app.component('my-btn', MyBtn);

/** 全局监听报错 */
app.config.errorHandler = function (err, instance, info) {
  console.log(err, instance, info);
};

app.use(router).use(Antd).mount('#app');
