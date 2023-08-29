<script setup lang="ts">
import { theme } from 'ant-design-vue';

const { defaultAlgorithm, defaultSeed } = theme;
const mapToken = defaultAlgorithm({
  ...defaultSeed,
  colorPrimary: '#ff17ef',
  gray: '#ff17ef'
});
console.log(defaultSeed, mapToken, 'defaultSeed');
</script>

<template>seed</template>
