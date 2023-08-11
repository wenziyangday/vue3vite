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
    path: '/403',
    component: () => import('@/views/error/403'),
    meta: {
      title: '403'
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
    path: '/500',
    component: () => import('@/views/error/500'),
    meta: {
      title: '500'
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
  },
  {
    path: '/:pathMatch(.*)*', // 解决路由爆[Vue Router warn]: No match found for location with path
    meta: {
      title: '找不到此页面'
    },
    hidden: true,
    component: () => import('@/views/error/404.vue') // 切记不要使用 redirect: '/403',
  },
  {
    path: '/system/user-auth',
    component: () => import('@/views/layout/layout'),
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: () => import('@/views/layout/layout'),
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: () => import('@/views/layout/layout'),
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  }
];

export const dynamicRoutes = [];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
});

export default router;
