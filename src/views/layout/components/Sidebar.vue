<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { usePermission } from '@/stores/permission';
import ItemSidebar from '@/views/layout/components/ItemSidebar.vue';

const permission = usePermission();
const { sidebarRouters } = permission;
const router = useRouter();
const selectKeys = ref([router.currentRoute.value.path]);
const openKeys = ref(['/system']);
// console.log(router.currentRoute.value, 'router.currentRoute.value.path');
// const { path } = router.currentRoute.value;

/**
 * menu item 点击事件
 * */
// const handleMenuClick = ({ item }): void => {
//   void router.push({
//     name: item.title
//   });
// };

const handleMenuClick = ({ item, key, keyPath }): void => {
  void router.push(key);
};
</script>
<template>
  <a-menu
    theme="dark"
    mode="inline"
    @click="handleMenuClick"
    v-model:selected-keys="selectKeys"
    v-model:openKeys="openKeys"
  >
    <item-sidebar :children="sidebarRouters" />
  </a-menu>
</template>
