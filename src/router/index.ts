import { createRouter, createWebHistory } from 'vue-router';

/**
 * 对于只有一个子路由的想单独显示在页面的 可以像首页那种设置方式进行设置
 * */
export const constantRoutes = [
  {
    path: '',
    component: () => import('@/views/layout/layout'),
    redirect: 'index',
    hidden: false,
    children: [
      {
        path: '/index',
        component: () => import('@/views/home'),
        hidden: false,
        name: 'Index',
        permissions: ['system:role:edit'],
        meta: {
          title: '首页'
        }
      }
    ]
  },
  {
    path: '/emulate',
    component: () => import('@/views/layout/layout'),
    hidden: false,
    meta: {
      title: 'emulate'
    },
    children: [
      {
        path: 'emulate',
        component: () => import('@/views/emulate'),
        hidden: false,
        name: 'Emulate',
        permissions: ['system:role:edit'],
        meta: {
          title: 'emulate'
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    meta: {
      title: '登录'
    },
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    meta: {
      title: '404'
    },
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    meta: {
      title: '401'
    },
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    meta: {
      title: '注册'
    },
    hidden: true
  },
  {
    path: '/wen/shop',
    component: () => import('@/views/shop'),
    meta: {
      title: '商店'
    },
    hidden: true
  }
];

export const dynamicRoutes = [];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
});

export default router;
