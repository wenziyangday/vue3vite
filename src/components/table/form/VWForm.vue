<script setup lang="ts">
import { Form } from 'ant-design-vue';
import { computed, inject, reactive } from 'vue';

import keyProvide from '@/constants/keyProvide';
import { type IFormItem } from '@/types/opts';

const props = withDefaults(
  defineProps<{
    // form item labelCol = {span: labelSpan}
    labelSpan?: number;
    // form表单
    options?: IFormItem[];
    // 表单校验规则
    rules: Record<string, unknown>;
  }>(),
  {
    labelSpan: 6,
    options: () => []
  }
);

/**
 * form item wrapperCol = {span: wrapSpan}
 * */
const wrapSpan = computed(() => 24 - props.labelSpan);

/**
 * 表单值, 不进行结构初始化，重置会失败
 * */
const defaultFormState = {};

props.options.forEach((option) => {
  const key = option.name;
  defaultFormState[key] = null;

  // 多选模式下 需要初始化为数组
  if (option.selectMode) {
    defaultFormState[key] = [];
  }
});
const formState = reactive(defaultFormState);
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

const { useForm } = Form;
const { validate, validateInfos, resetFields } = useForm(
  formState,
  props.rules
);
</script>

<template>
  <a-form
    :model="formState"
    :label-col="{ span: props.labelSpan }"
    :wrapper-col="{ span: wrapSpan }"
    :rules="rules"
  >
    <a-row :gutter="[16, 16]">
      <a-col
        v-for="option in options"
        :key="option.name"
        :span="option.colSpan ?? 12"
      >
        <a-form-item
          :label="option.label"
          :name="option.name"
          class="form-item"
        >
          <a-range-picker
            v-if="option.inputType === 'dateRangePicker'"
            v-model:value="formState[option.name]"
            style="width: 100%"
            allow-clear
          />

          <a-date-picker
            v-else-if="option.inputType === 'datePicker'"
            v-model:value="formState[option.name]"
            style="width: 100%"
            allow-clear
          />

          <a-tree-select
            v-else-if="option.inputType === 'treeSelect'"
            v-model:value="formState[option.name]"
            :tree-data="option.treeOptions"
            :field-names="option.fieldNames"
            :placeholder="`请选择${option.label}`"
            tree-default-expand-all
            style="width: 100%"
            allow-clear
          />

          <a-select
            v-else-if="option.inputType === 'select'"
            :mode="option.selectMode"
            :options="option.treeOptions ?? dictObjs[option.selectType]"
            :field-names="option.fieldNames"
            v-model:value="formState[option.name]"
            :placeholder="`请选择${option.label}`"
            style="width: 100%"
            show-arrow
            :show-search="false"
            allow-clear
          />

          <a-textarea
            v-else-if="option.inputType === 'textarea'"
            v-model:value="formState[option.name]"
            :placeholder="`请输入${option.label}`"
            style="width: 100%"
            allow-clear
          />

          <a-input-password
            v-else-if="option.inputType === 'inputPassword'"
            v-model:value="formState[option.name]"
            :placeholder="`请输入${option.label}`"
            style="width: 100%"
            allow-clear
            autocomplete
          />

          <a-input
            v-else
            v-model:value="formState[option.name]"
            :placeholder="`请输入${option.label}`"
            style="width: 100%"
            allow-clear
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<style lang="less" scoped>
.form-item {
  margin-bottom: 0;
}
</style>
