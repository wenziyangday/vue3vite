import { createRouter, createWebHistory } from 'vue-router';

export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/views/layout/layout'),
    meta: {
      title: '首页'
    },
    hidden: true,
    children: [
      {
        path: '/',
        component: () => import('@/views/home'),
        hidden: true,
        permissions: ['system:role:edit'],
        meta: {
          title: '首页'
        }
      },
      {
        path: '/register',
        component: () => import('@/views/register'),
        meta: {
          title: '注册'
        }
      },
      {
        path: '/wen/shop',
        component: () => import('@/views/shop'),
        meta: {
          title: '商店'
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
  }
];

export const dynamicRoutes = [];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
});

export default router;
