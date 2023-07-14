<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';

import { getCodeImg } from '@/apis/login';

const refNum: any = ref(0);
const reactData: any = reactive({
  name: '老张',
  arr: [1, 2, 3, 4]
});

function increaseNum(): any {
  console.log(refNum, 'ref');
  refNum.value++;
  getCodeImg().then((res) => {
    console.log(res);
  });
}

void function randomName() {
  reactData.name = Math.random();
  console.log(reactData);
  void nextTick(() => {
    console.log('我执行了nextTick');
  });
  reactData.arr[10] = Math.random() * 1000;
};

const computeName = computed(() => {
  return Number(reactData.name) > 0 ? reactData.name : '我是一个计算属性';
});
const computeArr10 = computed(() => {
  return reactData.arr[10] > 800 ? reactData.arr[10] : '我是一个计算数组数据';
});

watch(
  () => reactData.name,
  (newVal, oldVal) => {
    console.log(newVal, oldVal);
  },
  { immediate: true }
);
</script>

<template>
  <div class="reactive">
    这是一个响应数据 ref {{ refNum }}
    <button @click="increaseNum">点击</button>
  </div>
  <div class="reactive">
    这也是一个响应数据 reactive {{ reactData.name }}
    <button @click="randomName">点击更换name</button>

    <div>我是一个计算属性: {{ computeName }}</div>

    <div>
      <!--      这是一个更深层次的响应： {{ reactData.arr[10] }} 计算数据：-->
      {{ computeArr10 }}
    </div>
  </div>
</template>

<style scoped>
@import url('index.css');
</style>
