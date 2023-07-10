import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
const { env } = import.meta
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin({ include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.ts', 'src/*.js', 'src/*.vue', 'src/*.ts', 'vite.config.ts'] })
  ],
  css: {},
  server: {
    host: '0.0.0.0',
    port: 9600,
    cors: true,
    open: true,
    // 反向代理
    proxy: {
      [env.VITE_APP_BASE_API]: {
        target: env.VITE_APP_BASE_API_URL,
        changeOrigin: true,
        pathRewrite: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          [`^${env.VITE_APP_BASE_API}`]: ''
        }
      }
    }
  }
})
