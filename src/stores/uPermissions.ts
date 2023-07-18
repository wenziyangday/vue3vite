import { defineStore } from 'pinia';

import { getRouters } from '@/apis/menu';
import InnerLink from '@/components/inner-link/InnerLink.vue';
import ParentView from '@/components/parent-view/ParentView.vue';
import auth from '@/plugins/auth';
import router, { constantRoutes, dynamicRoutes } from '@/router';
import Layout from '@/views/layout.vue';

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter?, type = false): any[] {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout;
      } else if (route.component === 'ParentView') {
        route.component = ParentView;
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children?.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route.children;
      delete route.redirect;
    }
    return true;
  });
}

function filterChildren(childrenMap, lastRouter = false): any[] {
  let children = [];
  childrenMap.forEach((el) => {
    if (el.children?.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach((c = {}) => {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          c.path = `${el.path}/${c.path}`;
          if (c.children?.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      el.path = lastRouter.path + '/' + el.path;
    }
    children = children.concat(el);
  });
  return children;
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes): any[] {
  const res = [];
  routes.forEach((route) => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route);
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route);
      }
    }
  });
  return res;
}

export const loadView = (view: string): Promise => {
  if (import.meta.env.MODE === 'development') {
    return (resolve) => require([`@/views/${view}.vue`], resolve);
  } else {
    // 使用 import 实现生产环境的路由懒加载
    return () => import(`@/views/${view}.vue`);
  }
};

export const useUPermission = defineStore('permission', {
  state: () => {
    return {
      routes: [],
      addRoutes: [],
      defaultRoutes: [],
      topBarRouters: [],
      sidebarRouters: []
    };
  },
  actions: {
    generatorRoutes(): Promise {
      return new Promise((resolve, reject) => {
        // 获取路由数据
        getRouters()
          .then((res) => {
            const sData = JSON.parse(JSON.stringify(res.data));
            const rData = JSON.parse(JSON.stringify(res.data));
            const sidebarRoutes = filterAsyncRouter(sData);
            const rewriteRoutes = filterAsyncRouter(rData, false, true);
            const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
            rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true });
            router.addRoutes(asyncRoutes);
            this.routes = rewriteRoutes;
            this.sidebarRouters = [...constantRoutes, ...sidebarRoutes];
            this.defaultRoutes = this.topBarRouters = sidebarRoutes;
            resolve(rewriteRoutes);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
});
