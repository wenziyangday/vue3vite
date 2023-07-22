<script setup lang="ts">
import Sidebar from '@/views/layout/components/Sidebar.vue';
import TopBar from '@/views/layout/components/Topbar.vue';
</script>
<template>
  <a-layout class="wrap-layout" has-sider>
    <a-layout-sider class="sticky-sidebar">
      <sidebar />
    </a-layout-sider>
    <a-layout-content class="content-margin">
      <top-bar />
      <div class="app-content">
        <router-view />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<style scoped lang="less">
.wrap-layout {
  min-height: 100vh;

  .sticky-sidebar {
    height: 100vh;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 9;
    overflow: auto;
  }

  .app-content {
    padding: 20px;
  }
}
</style>
