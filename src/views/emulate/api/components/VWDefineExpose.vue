<script setup lang="ts">
import { ref } from 'vue';

const complex = ref<string>('defineExpose');

defineExpose({
  complex
});
</script>

<template>{{ complex }}</template>
