<script setup lang="ts">
import { reactive } from 'vue';

const people = reactive({ name: '张三', age: 100, sex: '男' });

const handleDebounce = (): void => {
  console.log(Math.random());
};
</script>

<template>
  <a-button type="primary" v-demo:age.name="people">自定义指令 v-demo</a-button>
  <a-button type="primary" v-debounce="handleDebounce"
    >自定义指令 v-debounce
  </a-button>
</template>
