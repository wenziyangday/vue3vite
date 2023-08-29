<script setup lang="ts">
import { reactive, ref, watch } from 'vue';

const valued = ref('');
const valued2 = ref({ name: '' });
const valued23 = reactive({ name: '' });
const valued234 = reactive({ name: '' });
const valued2345 = reactive({ name: '' });

watch(valued, (value, oldValue, onCleanup) => {
  console.log(value, oldValue, onCleanup);
});

watch(
  () => JSON.parse(JSON.stringify(valued2.value)),
  (value, oldValue, onCleanup) => {
    console.log(value, oldValue, onCleanup);
  },
  {
    deep: true
  }
);

watch(
  () => JSON.parse(JSON.stringify(valued23)),
  (value, oldValue, onCleanup) => {
    console.log(value, oldValue, onCleanup);
  },
  {
    deep: true
  }
);

watch(
  () => valued234.name,
  (value, oldValue, onCleanup) => {
    console.log(value, oldValue, onCleanup);
  },
  {
    deep: true
  }
);

watch(
  () => valued234.name,
  (value, oldValue, onCleanup) => {
    console.log(value, oldValue, onCleanup, 'kkklk');
  },
  {
    deep: true
  }
);

watch(
  () => valued2345,
  (value, oldValue, onCleanup) => {
    console.log(value, oldValue, onCleanup);
  },
  {
    deep: true
  }
);
</script>

<template>
  <a-input v-model:value="valued" />
  <a-input v-model:value="valued2.name" />
  <a-input v-model:value="valued23.name" />
  <a-input v-model:value="valued234.name" />
  <a-input v-model:value="valued2345.name" />
</template>
