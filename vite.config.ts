import vue from '@vitejs/plugin-vue';
import { theme } from 'ant-design-vue';
import path from 'path';
import postCssPxToViewport from 'postcss-px-to-viewport-8-plugin';
import { defineConfig, loadEnv } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

// 设置antDesign主题
const { defaultAlgorithm, defaultSeed } = theme;
const mapToken = defaultAlgorithm(defaultSeed);
// https://vitejs.dev/config/
export default ({ mode }): any => {
  // 参数mode为开放模式或生产模式
  const env = loadEnv(mode, process.cwd()); // 获取.env文件里定义的环境变量
  const port = env.port ?? env.npm_config_port ?? 9527;
  return defineConfig({
    // 项目部署在主域名的子文件使用,例如http://localhost:3000/myvite/。不填默认就是/
    base: env.VITE_APP_BASE_URL ?? '/',
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: mapToken
        }
      },
      postcss: {
        plugins: [
          // 响应式
          postCssPxToViewport({
            unitToConvert: 'pxx', // 要转化的单位
            viewportWidth: 750, // UI设计稿的宽度
            unitPrecision: 6, // 转换后的精度，即小数点位数
            propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
            fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
            selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
            minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
            mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
            replace: true, // 是否转换后直接更换属性值
            exclude: [/node_modules/, /g.less/, /antd/], // 设置忽略文件，用正则做目录名匹配
            // exclude: [],
            landscape: false // 是否处理横屏情况
          })
        ]
      }
    },
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
    resolve: {
      // 文件目录别名
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src')
        },
        { find: /^~/, replacement: '' }
      ],
      // 扩展名导入忽略
      extensions: [
        '.mjs',
        '.cjs',
        '.js',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
        '.vue'
      ]
    },
    server: {
      host: '0.0.0.0',
      port,
      open: true,
      proxy: {
        [env.VITE_APP_PROXY_API]: {
          target: env.VITE_APP_API,
          changeOrigin: true,
          pathRewrite: {
            [`^${env.VITE_APP_BASE_API}`]: ''
          }
        }
      }
    }
  });
};
