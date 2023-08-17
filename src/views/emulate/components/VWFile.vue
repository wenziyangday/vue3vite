<script setup lang="ts">
import { getIcons } from '@/utils/file';

const reg = /id="(.*?)"/g;

getIcons().then((res) => {
  console.log(
    res.data
      .match(reg)
      .map((item) => item.replace('id="', '').replace('"', '')),
    'dee'
  );
});
</script>

<template>klklklkl</template>
