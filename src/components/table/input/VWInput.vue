<!--组件的双向绑定-->
<script setup lang="ts">
defineProps<{
  inputType?: string;
}>();
</script>

<template>
  <a-range-picker
    v-if="inputType === 'dateRangePicker'"
    v-model:value="formState[option.name]"
    style="width: 100%"
    allow-clear
  />

  <a-date-picker
    v-else-if="inputType === 'datePicker'"
    v-model:value="formState[option.name]"
    style="width: 100%"
    allow-clear
  />

  <a-select
    v-else-if="inputType === 'select'"
    :options="dictObjs[option.selectType]"
    v-model:value="formState[option.name]"
    style="width: 100%"
    allow-clear
  />

  <a-input
    v-else
    v-model:value="formState[name]"
    style="width: 100%"
    allow-clear
  />
</template>
