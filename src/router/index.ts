import { createRouter, createWebHistory } from 'vue-router';

const constantRoutes = [
  {
    path: '/',
    component: () => import('@/views/layout'),
    children: [
      {
        path: '/',
        component: () => import('@/views/home'),
        hidden: true,
        permissions: ['system:role:edit'],
        meta: {}
      },
      {
        path: '/register',
        component: () => import('@/views/register'),
        meta: {}
      },
      {
        path: '/shop',
        component: () => import('@/views/shop'),
        meta: {}
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  }
];
// const dynamicRoutes = [];
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
});

export default router;
