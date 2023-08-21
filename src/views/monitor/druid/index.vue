<script setup lang="ts">
import { ref } from 'vue';

const srcRef = ref<string>('');
srcRef.value = `${import.meta.env.VITE_APP_BASE_API}/druid/login.html`;
</script>

<template>
  <iframe
    :src="srcRef"
    frameborder="no"
    style="width: 100%; height: 80vh"
    scrolling="auto"
  />
</template>
