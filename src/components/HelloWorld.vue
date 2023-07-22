<script setup lang="ts">
const props = defineProps<{ msg: string }>();
console.log(props, props.msg);
</script>

<template>
  <h1>{{ msg }}</h1>
  <a-divider dashed />
</template>
