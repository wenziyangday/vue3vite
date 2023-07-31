<script setup lang="ts">
defineProps<{
  msg: string;
}>();
</script>

<template>
  <div class="title">{{ msg }}</div>
  <a-divider class="divider-margin" />
</template>

<style lang="less" scoped>
.title {
  font-size: 14px;
  color: @colorPrimary;
}

.divider-margin {
  margin: 16px 0;
}
</style>
