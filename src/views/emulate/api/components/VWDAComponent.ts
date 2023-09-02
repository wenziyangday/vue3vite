import { LoadingOutlined } from '@ant-design/icons-vue';
import { defineAsyncComponent } from 'vue';

export default defineAsyncComponent({
  loader: () => import('./VWComm.vue'),
  loadingComponent: LoadingOutlined,
  delay: 10000,
  timeout: 100000
});
