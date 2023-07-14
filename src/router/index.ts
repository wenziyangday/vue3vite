import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/register',
    component: () => import('@/views/register')
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
