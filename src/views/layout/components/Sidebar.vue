<script setup lang="ts">
import { useRouter } from 'vue-router';

import { usePermission } from '@/stores/permission';
import ItemSidebar from '@/views/layout/components/ItemSidebar.vue';

const permission = usePermission();
const { sidebarRouters } = permission;
const router = useRouter();
console.log(router.getRoutes(), 'router');

/**
 * menu item 点击事件
 * */
const handleMenuClick = ({ key }): void => {
  void router.push(key);
};
</script>
<template>
  <a-menu theme="dark" mode="inline" @click="handleMenuClick">
    <item-sidebar :children="sidebarRouters" />
  </a-menu>
</template>
