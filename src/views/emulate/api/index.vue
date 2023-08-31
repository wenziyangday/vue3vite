<script setup lang="ts">
import { onMounted, ref } from 'vue';

import VWComm from '@/views/emulate/api/components/VWComm.vue';
import VWDirective from '@/views/emulate/api/components/VWDirective.vue';
import VWLifecycle from '@/views/emulate/api/components/VWLifecycle.vue';
import VWNotSetup from '@/views/emulate/api/components/VWNotSetup.vue';
import VWReactive from '@/views/emulate/api/components/VWReactive.vue';
import VWSetup from '@/views/emulate/api/components/VWSetup.vue';

console.log('我是父级--我执行了');
const msg = ref<string>('接收参数props');
const handleMsg = (): void => {
  msg.value = `抛出事件emit ${Math.random()}`;
};

onMounted(() => {
  console.log('我是父级--onMounted--我执行了');
});
</script>

<template>
  <a-divider orientation="left" :orientation-margin="0">
    指令：自定义指令、v-memo
  </a-divider>
  <v-w-directive />

  <a-divider orientation="left" :orientation-margin="0">
    组件通信：defineExpose、provide、inject、defineEmits、defineProps
  </a-divider>
  <v-w-comm :msg="msg" @change="handleMsg" />

  <a-divider orientation="left" :orientation-margin="0">
    组件的生命周期(结合setup生命周期)
  </a-divider>
  <v-w-lifecycle />

  <a-divider orientation="left" :orientation-margin="0">
    setup使用场景
  </a-divider>
  <v-w-setup />
  <v-w-not-setup />

  <a-divider orientation="left" :orientation-margin="0">响应式API</a-divider>
  <v-w-reactive />
</template>
