<script setup lang="ts">
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue';

defineProps<{ msg: string }>();

onBeforeMount(() => {
  console.log('onBefore   ====>  vue2.0 x beforemount');
});
onMounted(() => {
  console.log('onMounted  ====>  vue2.0 x mount');
});
onBeforeUpdate(() => {
  console.log('onBeforeUpdate  ====>  vue2.0 x beforeUpdate');
});
onUpdated(() => {
  console.log('onUpdated  ====>  vue2.0 x update');
});
onBeforeUnmount(() => {
  // 在卸载组件实例之前调用。在这个阶段，实例仍然是完全正常的。
  console.log('onBeforeUnmount ====>  vue2.0 x beforeDestroy');
});
onUnmounted(() => {
  // 卸载组件实例后调用,调用此钩子时,组件实例的所有指令都被解除绑定,所有事件侦听器都被移除,所有子组件实例被卸载。
  console.log('onUnmounted ====>  vue2.0 x destroyed');
});
</script>

<template>
  <h1>{{ msg }}</h1>
  <a-divider dashed />
</template>
