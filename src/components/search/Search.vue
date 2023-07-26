<!--table 搜索条件-->
<script setup lang="ts">
import { useForm } from 'ant-design-vue/es/form';
import { computed, inject, reactive, ref } from 'vue';

import keyProvide from '@/constants/keyProvide';
import { type IOptSearch } from '@/types/opts';

const props = withDefaults(
  defineProps<{
    // form item labelCol = {span: labelSpan}
    labelSpan?: number;
    // form表单
    options?: IOptSearch[];
  }>(),
  {
    labelSpan: 6,
    options: () => []
  }
);

const emit = defineEmits<{
  searchCb: [formStatus: unknown];
  resetCb;
}>();

/**
 * form item wrapperCol = {span: wrapSpan}
 * */
const wrapSpan = computed(() => 24 - props.labelSpan);

/**
 * 展开的输入框
 * */
const expandInputs = computed(() => {
  if (props.options.length >= 4) {
    return props.options.slice(0, 4);
  }

  return props.options;
});

/**
 * 收起的输入框
 * */
const foldInputs = computed(() => {
  if (props.options.length > 4) {
    return props.options.slice(4);
  }
  return [];
});

/**
 * 下拉框的options
 * */
const selectTypes = computed(() =>
  props.options
    .filter((option) => option?.selectType)
    .map((option) => option.selectType)
);
/**
 * 全局获取字典值
 * */
const dictInject = inject(keyProvide.$getDict);
let dictObjs = reactive({});
if (selectTypes.value.length > 0) {
  dictInject(selectTypes.value);
  dictObjs = inject(keyProvide.dictObjs);
}

/**
 * 展开/隐藏控制器
 * */
const showExpandFold = computed(() => foldInputs.value.length > 0);
const controlShowExpandFold = ref<boolean>(false);
const handleControlShowExpandFold = (): void => {
  controlShowExpandFold.value = !controlShowExpandFold.value;
};

/**
 * 搜索表单值, 不进行结构初始化，重置会失败
 * */
const defaultFormState = {};
props.options.forEach((option) => {
  defaultFormState[option.name] = null;
});
const formState = reactive(defaultFormState);

/**
 * 搜索点击事件
 * */
const handleSearch = (): void => {
  emit('searchCb', formState);
};

/**
 * 重置点击按钮
 * */
const formFun = useForm(formState);
const resetForm = (): void => {
  formFun.resetFields();
  emit('resetCb');
};
</script>

<template>
  <a-form
    :model="formState"
    class="form-margin"
    layout="inline"
    :label-col="{ span: props.labelSpan }"
    :wrapper-col="{ span: wrapSpan }"
  >
    <a-row :gutter="[16, 16]" style="width: 100%">
      <a-col :span="5" v-for="eInput in expandInputs" :key="eInput.label">
        <a-form-item
          :label="eInput.label"
          :name="eInput.name"
          class="form-item"
        >
          <a-range-picker
            v-if="eInput.inputType === 'timeRange'"
            v-model:value="formState[eInput.name]"
            style="width: 100%"
            allow-clear
          />

          <a-select
            v-else-if="eInput.inputType === 'select'"
            :options="dictObjs[eInput.selectType]"
            v-model:value="formState[eInput.name]"
            style="width: 100%"
            allow-clear
          />

          <a-input
            v-else
            v-model:value="formState[eInput.name]"
            style="width: 100%"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <a-col :span="4">
        <a-row justify="space-between">
          <a-col v-if="showExpandFold">
            <a-tooltip placement="top">
              <template #title>
                <span>{{ controlShowExpandFold ? '隐藏' : '展开' }}</span>
              </template>
              <a-button
                type="text"
                class="btn"
                @click="handleControlShowExpandFold"
              >
                <down-outlined v-if="!controlShowExpandFold" />
                <up-outlined v-else />
              </a-button>
            </a-tooltip>
          </a-col>
          <a-col>
            <a-button type="primary" html-type="submit" @click="handleSearch">
              <search-outlined />
              搜索
            </a-button>
          </a-col>
          <a-col>
            <a-button type="default" html-type="reset" @click="resetForm">
              <sync-outlined />
              重置
            </a-button>
          </a-col>
        </a-row>
      </a-col>
      <template v-if="showExpandFold && controlShowExpandFold">
        <a-col :span="5" v-for="foldInput in foldInputs" :key="foldInput.label">
          <a-form-item
            :label="foldInput.label"
            :name="foldInput.name"
            class="form-item"
          >
            <a-range-picker
              v-if="foldInput.inputType === 'timeRange'"
              v-model:value="formState[foldInput.name]"
              style="width: 100%"
              allow-clear
            />

            <a-select
              v-else-if="foldInput.inputType === 'select'"
              :options="dictObjs[foldInput.selectType]"
              v-model:value="formState[foldInput.name]"
              style="width: 100%"
              allow-clear
            />

            <a-input
              v-else
              v-model:value="formState[foldInput.name]"
              style="width: 100%"
              allow-clear
            />
          </a-form-item>
        </a-col>
      </template>
    </a-row>
  </a-form>
</template>

<style lang="less" scoped>
.form-margin {
  .form-item {
    margin-right: 0;
  }

  .btn {
    padding: 0;
  }
}
</style>
