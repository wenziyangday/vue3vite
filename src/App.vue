<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { inject, reactive } from 'vue';

import keyProvide from '@/constants/keyProvide';
import { reg } from '@/constants/rexg';
import { getIcons } from '@/utils/file';

const dictObjs = inject(keyProvide.dictObjs);
const data = reactive({
  colorPrimary: '#ff17ef',
  fontSize: 12,
  borderRadius: 4
});

// 全局icons
getIcons().then((res) => {
  dictObjs[keyProvide.icons] = res.data
    .match(reg)
    .map((item) => item.replace('id="', '').replace('"', ''))
    .sort((a, b) => a.localeCompare(b))
    .map((icon) => ({
      label: icon,
      value: icon
    }));
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

<style lang="less">
.form-item-margin {
  margin: 16px 0;
}
</style>
