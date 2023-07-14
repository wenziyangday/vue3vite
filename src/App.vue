<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
const routes = [
  {
    path: '/',
    text: '首页'
  },
  {
    path: '/shop',
    text: '商店'
  },
  {
    path: '/login',
    text: '登录'
  },
  {
    path: '/register',
    text: '注册'
  }
];

/**
 * 路由点击跳转
 * */
const routerClick = (event): void => {
  const { path } = event.target.dataset;
  if (path) {
    void router.push(path);
  }
};
</script>

<template>
  <div class="link" @click="routerClick">
    <div
      class="item"
      v-for="item in routes"
      :key="item.path"
      :data-path="item.path"
    >
      {{ item.text }}
    </div>
  </div>
  <router-view></router-view>
</template>

<style scoped>
.link {
  display: flex;
  align-items: center;
  justify-content: center;
}

.item {
  margin: 20px;
  cursor: pointer;
}
</style>
