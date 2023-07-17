<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const data = reactive({
  colorPrimary: '#ff17ef',
  fontSize: 12,
  borderRadius: 4
});

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
    <input
      type="color"
      :value="data.colorPrimary"
      @input="(e) => (data.colorPrimary = e.target.value)"
    />
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
