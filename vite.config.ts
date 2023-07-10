import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default ({ mode }): any => {
  // 参数mode为开放模式或生产模式
  const env = loadEnv(mode, process.cwd()); // 获取.env文件里定义的环境变量
  return defineConfig({
    plugins: [
      vue(),
      eslintPlugin({
        include: [
          'src/**/*.js',
          'src/**/*.vue',
          'src/**/*.ts',
          'src/*.js',
          'src/*.vue',
          'src/*.ts',
          'vite.config.ts'
        ]
      })
    ],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_APP_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    // 项目部署在主域名的子文件使用,例如http://localhost:3000/myvite/。不填默认就是/
    base: env.VITE_APP_BASE_URL ?? '/'
  });
};
