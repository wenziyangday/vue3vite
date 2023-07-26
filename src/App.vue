<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { reactive } from 'vue';

const data = reactive({
  colorPrimary: '#ff17ef',
  fontSize: 12,
  borderRadius: 4
});
</script>

<template>
  <a-config-provider
    :theme="{
      token: data
    }"
    :locale="zhCN"
  >
    <a-watermark content="vincent wen">
      <router-view></router-view>
    </a-watermark>
  </a-config-provider>
</template>
