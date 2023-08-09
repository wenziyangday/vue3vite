<!--确认框的内容、删除框的内容-->
<script setup lang="ts">
import { type OptTypeCN } from '@/types/opts';

withDefaults(
  defineProps<{
    msg?: string;
    optTypeCN?: OptTypeCN;
    word?: string;
  }>(),
  {
    msg: '1',
    icon: 'warning-outlined',
    optTypeCN: '删除',
    word: ''
  }
);
</script>

<template>
  <span v-if="word">{{ word }}</span>
  <span v-else>是否确认{{ optTypeCN }}编号为{{ msg }}的数据项？</span>
</template>

<style scoped lang="less">
span {
  margin-left: 16px;
}
</style>
