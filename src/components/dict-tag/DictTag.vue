<!--字典数据标签处理（枚举数据标签处理）-->
<script setup lang="ts">
import { computed, ref } from 'vue';

import { type IDict } from '@/types/dicts';
import { colorListClass } from '@/utils/tools';

interface IDictTag {
  options?: IDict[] | null;
  value?: string | number | any[];
  showValue?: boolean;
}

const props = defineProps<IDictTag>();

/**
 * 处理values
 * */
const values: unknown[] = computed(() => {
  if (props.value && typeof props.value !== 'undefined') {
    return Array.isArray(props.value) ? props.value : [String(props.value)];
  }

  return [];
});

/**
 * 存在在已有元素中的元素
 * */
const optionsFilter: IDict[] = computed(
  () => props.options?.filter((option) => values.value.includes(option.value))
);

/**
 * 未匹配的标签数据
 * */
const unMatchedArray = ref<any[]>([]);
const handleUnMatchedArray: string = computed(() => '暂时');

/**
 * 未匹配数据
 * */
const unMatched: boolean = () => {
  // 重置
  unMatchedArray.value = [];
  if (props.value && typeof props.value !== 'undefined') {
    if (!Array.isArray(props.value)) {
      if (props.options?.some((option) => option.value === props.value)) {
        return false;
      }
      unMatchedArray.value.push(props.value);
      return true;
    }
  }
  return false;
};
</script>

<template>
  <template v-for="option in optionsFilter" :key="option.value">
    <span
      v-if="!option.raw.listClass || option.raw.listClass === 'default'"
      :class="option.raw.cssClass"
    >
      {{ option.label }}
    </span>
    <a-tag
      v-else
      :class="option.raw.cssClass"
      :color="colorListClass(option.raw.listClass)"
      :style="optionsFilter.length > 0 ? 'margin-right: 0' : ''"
      >{{ option.label }}
    </a-tag>
  </template>
  <template v-if="unMatched && showValue">
    {{ handleUnMatchedArray }}
  </template>
</template>
