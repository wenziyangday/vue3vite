<script setup lang="ts">
import { reactive, ref } from 'vue';

// const defaultOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const defaultOptions = [{ name: 1 }, { name: 2 }, { name: 3 }];
const arrRef = ref<number[]>(defaultOptions.slice());
const arrReactive = reactive<number[]>(defaultOptions);

const handleArr = (type: number): void => {
  if (type === 1) {
    arrRef.value.splice(0, 1);
  } else {
    arrRef.value = defaultOptions.slice();
  }
  console.log(arrRef.value, arrReactive, defaultOptions);
};
</script>

<template>
  响应式数据 arrRef: {{ arrRef }} arrReactive: {{ arrReactive }}
  <a-button
    v-for="(item, index) in arrRef"
    :key="index"
    @click="handleArr(item.name)"
    >点击 {{ item }}
  </a-button>
</template>
