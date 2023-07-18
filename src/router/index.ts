import 'nprogress/nprogress.css';

import NProgress from 'nprogress';
import { createRouter, createWebHistory } from 'vue-router';

import { usePermission } from '@/stores/permission';
import { useUser } from '@/stores/user';
import { isReLogin } from '@/utils/request';
import { getToken } from '@/utils/token';

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

NProgress.configure({ showSpinner: false });
const whiteList: string[] = ['/login', '/auth-redirect', '/bind', '/register'];

router.beforeEach((to, from, next) => {
  NProgress.start();
  const permission = usePermission();
  const user = useUser();
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      if (user.roles.length === 0) {
        isReLogin.show = true;
        // 拉取用户信息
        user
          .getInfoACT()
          .then(() => {
            // 动态获取权限路由表
            permission.generatorRoutes().then((gRoutes) => {
              // 根据roles权限生成可访问的路由表
              router.addRoute(gRoutes); // 动态添加可访问路由表
              // hack方法 确保addRoutes已完成
              next({ ...to, replace: true });
            });
          })
          .catch((err) => {
            void user
              .logoutACT()
              .then(() => {
                NProgress.error(err);
              })
              .catch();
          });
      } else {
        next();
      }
    }
  } else {
    if (whiteList?.includes(to.path)) {
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => NProgress.done());

export default router;
