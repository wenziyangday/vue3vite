<script setup lang="ts">
defineProps<{ msg: string }>()
</script>

<template>
  <h4>my-btn {{ msg }}</h4>
  <a-divider dashed/>
</template>
