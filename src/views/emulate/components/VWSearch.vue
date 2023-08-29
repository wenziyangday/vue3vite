<script setup lang="ts">
import Search from '@/components/table/search/Search.vue';
import useTableRequest from '@/plugins/hooks/useTableRequest';
import { type IOptSearch } from '@/types/opts';

const options: IOptSearch[] = [
  { label: '字典名称', name: 'dictName' },
  { label: '字典类型', name: 'dictType' }
];

const defaultValue = {
  dictType: '字典类型'
};
const { formStatus, searchCb } = useTableRequest();

// const searchCb = (value): void => {
//   console.log(formStatus.value, value);
// };
</script>

<template>
  {{ formStatus }}
  <search
    :options="options"
    @search-cb="searchCb"
    :default-value="defaultValue"
  />
</template>
