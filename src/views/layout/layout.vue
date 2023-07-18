<script setup lang="ts">
import Sidebar from '@/views/layout/components/Sidebar.vue';
</script>
<template>
  <a-layout class="wrap-layout" has-sider>
    <a-layout-sider class="fixed-sidebar">
      <sidebar />
    </a-layout-sider>
    <a-layout-content class="content-margin">
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>

<style scoped lang="less">
.wrap-layout {
  min-height: 100vh;

  .fixed-sidebar {
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    overflow: auto;
  }

  .content-margin {
    margin-left: 200px;
  }
}
</style>
