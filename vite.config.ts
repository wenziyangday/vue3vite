import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {},
  server: {
    proxy: {},
    /** 开发服务器配置 CORS **/
    cors: true
  }
});
