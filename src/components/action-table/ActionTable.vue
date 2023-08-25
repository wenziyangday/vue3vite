<!--table 操作按钮-->
<script setup lang="ts">
import { type ButtonType } from 'ant-design-vue/es/button';
import { type SizeType } from 'ant-design-vue/es/config-provider/context';
import { computed, ref } from 'vue';

import { opts as optsCONSTANT } from '@/constants/opts';
import { type OptType } from '@/types/opts';

const props = withDefaults(
  defineProps<{
    // 按钮选项
    options?: OptType[];
    // ButtonType
    btnType?: ButtonType;
    // SizeType
    btnSize?: SizeType;
    // row gutter
    rowGutter?: number | number[];
    // 第几个后开始出现折叠
    dropdownLength?: number;
  }>(),
  {
    options: () => [],
    btnType: () => 'default',
    btnSize: () => 'middle',
    rowGutter: () => 0,
    dropdownLength: () => 2
  }
);

const emit = defineEmits<{
  clickCb: [type: OptType];
}>();

/**
 * 默认操作数组
 * */
const defaultOpts = ref(optsCONSTANT);

/**
 * 可用的操作按钮
 * */
const opts = computed(() => {
  if (props.options && props.options.length > 0) {
    return defaultOpts.value.filter((opt) => props.options.includes(opt.type));
  }

  return defaultOpts.value;
});

/**
 * 展开的操作按钮
 * */
const expandOpts = computed(() => {
  if (opts.value.length >= props.dropdownLength) {
    return opts.value.slice(0, props.dropdownLength);
  }

  return opts.value;
});

/**
 * 折叠的操作按钮
 * */
const foldOpts = computed(() => {
  if (opts.value.length > props.dropdownLength) {
    return opts.value.slice(props.dropdownLength);
  }

  return [];
});

/**
 * cb 回调
 * */
const handleEmit = (type: string): void => {
  emit('clickCb', type);
};
</script>

<template>
  <a-row justify="center" :gutter="props.rowGutter">
    <a-col :span="1.5" v-for="(opt, index) in expandOpts" :key="index">
      <a-button
        :size="props.btnSize"
        :type="props.btnType"
        @click.stop="handleEmit(opt.type)"
      >
        <template #icon>
          <component :is="opt.icon"></component>
        </template>
        <span style="margin-left: 4px">{{ opt.label }}</span>
      </a-button>
    </a-col>
    <slot name="opt" :size="props.btnSize" :type="props.btnType" />
    <a-col :span="1.5" v-if="foldOpts.length > 0">
      <a-dropdown arrow>
        <a-button :size="props.btnSize" :type="props.btnType">
          <span style="margin-right: -4px">更多</span>
          <down-outlined />
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item v-for="(foldOpt, index) in foldOpts" :key="index">
              <a-button
                size="small"
                type="link"
                @click.stop="handleEmit(foldOpt.type)"
              >
                <template #icon>
                  <component :is="foldOpt.icon"></component>
                </template>
                <span style="margin-left: 4px">{{ foldOpt.label }}</span>
              </a-button>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-col>
  </a-row>
</template>

<style lang="less" scoped>
.icon-word {
  display: block;
  margin-left: 0;
}
</style>
