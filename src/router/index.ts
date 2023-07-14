import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/views/home')
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/register',
    component: () => import('@/views/register')
  },
  {
    path: '/shop',
    component: () => import('@/views/shop')
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
