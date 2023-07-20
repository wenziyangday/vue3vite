import 'nprogress/nprogress.css';

import NProgress from 'nprogress';

import router from '@/router';
import { usePermission } from '@/stores/permission';
import { useUser } from '@/stores/user';
import { isReLogin } from '@/utils/request';
import { clearStorage } from '@/utils/storeage';
import { getToken } from '@/utils/token';

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
              gRoutes.forEach((route) => {
                if (route.path.indexOf('http') === -1) {
                  router.addRoute(route);
                }
              });
              // hack方法 确保addRoutes已完成
              next({ ...to, replace: true });
            });
          })
          .catch(() => {
            void user
              .logoutACT()
              .then(() => {
                clearStorage();
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
