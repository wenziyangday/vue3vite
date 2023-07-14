<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
const routes = [
  {
    path: '/',
    text: '首页'
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const routerClick = async (event) => {
  const { path } = event.target.dataset;
  if (path) {
    await router.push(path);
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
