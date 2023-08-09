<!--form子组件初始化值时 存在时序问题-->
<script setup lang="ts">
import { Form } from 'ant-design-vue';
import { computed, inject, reactive, ref, watch } from 'vue';

import keyProvide from '@/constants/keyProvide';
import { type IFormItem } from '@/types/opts';

const props = withDefaults(
  defineProps<{
    // form item labelCol = {span: labelSpan}
    labelSpan?: number;
    // row 几等分
    bisection?: 1 | 2 | 3 | 4 | 12;
    // form表单
    options?: IFormItem[];
    // 表单校验规则
    rules?: Record<string, unknown>;
    // 默认值
    defaultValue?: Record<string, unknown>;
    // 表单是否可操作（整体操作）
    disabled?: boolean;
  }>(),
  {
    labelSpan: 6,
    bisection: 2,
    disabled: false,
    options: () => [],
    defaultValue: () => {}
  }
);
/**
 * form item wrapperCol = {span: wrapSpan}
 * */
const wrapSpan = computed(() => 24 - props.labelSpan);

/**
 * 表单值, 不进行结构初始化，重置会失败
 * */

const defaultState = {};
const keys = Object.keys(props.defaultValue ?? {});
if (keys.length === 0) {
  props.options.forEach((option) => {
    const key = option.name;
    defaultState[key] = null;

    if (option.inputType === 'radio') {
      defaultState[key] = '0';
    }

    // 多选模式下 需要初始化为数组
    if (option.selectMode) {
      defaultState[key] = [];
    }
  });
} else {
  const defaultValueKeys = Object.keys(props.defaultValue);
  const optionsEntries = Object.fromEntries(
    props.options.map((option) => [option.name, option])
  );

  defaultValueKeys.forEach((key) => {
    if (optionsEntries[key]) {
      if (props.defaultValue[key]) {
        defaultState[key] = props.defaultValue[key];
      } else {
        defaultState[key] = null;

        if (optionsEntries[key]?.inputType === 'radio') {
          defaultState[key] = '0';
        }

        // 多选模式下 需要初始化为数组
        if (optionsEntries[key]?.selectMode) {
          defaultState[key] = [];
        }
      }
    }
  });
}

const formState = ref<Record<string, unknown>>(defaultState);
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

// 等分处理
const handleBisection = (bisection?: number): number => {
  if (!bisection) {
    bisection = props.bisection;
  }
  return 24 / bisection;
};

// 绑定处理
const handleBind = (option: IFormItem): unknown => {
  let labelSpan = props.labelSpan;
  let contentSpan = wrapSpan;

  if (!option.label) {
    labelSpan = 0;
    contentSpan = 24;
  } else if (option.bisection) {
    labelSpan = props.labelSpan / props.bisection;
    contentSpan = computed(() => 24 - labelSpan);
  }

  return {
    labelCol: {
      span: labelSpan
    },
    wrapperCol: {
      span: contentSpan.value
    },
    ...validateInfos?.[option.name]
  };
};

// 树形选择框
// 全选，全不选
const checkedKeys = ref([]);
// 展开keys
const expandedKeys = ref([]);
const treeCheckOptions = [
  {
    label: '展开/折叠',
    value: 'expandUnfold'
  },
  {
    label: '全选/全不选',
    value: 'checkAllUnCheck'
  },
  {
    label: '父子联动',
    value: 'linkage'
  }
];
const checkboxVal = reactive(['linkage']);
const checkStrictly = ref<boolean>(false);

// @wenTODO 这个地方还是有点问题 展开和不展开（取第一层或者第二层）
const handleCheckboxChange = (checkedValue): void => {
  if (checkedValue.includes('expandUnfold')) {
    expandedKeys.value = [1, 100];
  } else {
    expandedKeys.value = [];
  }
  if (checkedValue.includes('checkAllUnCheck')) {
    checkedKeys.value = [1, 100];
  } else {
    checkedKeys.value = [];
  }
  checkStrictly.value = !checkedValue.includes('linkage');
};

const relationShow = ref<IFormItem[]>([]);

// 关联数据显隐
const handelRelationShow = (option: IFormItem): boolean => {
  if (!option?.relationShow) {
    return true;
  }
  if (
    Array.isArray(option?.relationShow) &&
    option?.relationShow.length === 2
  ) {
    if (!relationShow.value.some((rs) => rs.name === option.name)) {
      relationShow.value.push(option);
    }
    const [key, val] = option?.relationShow;
    return formState.value[key] === val;
  }

  return false;
};

const handleDisable = (disable?: boolean): boolean => {
  if (String(props.disabled)) {
    return { disabled: props.disabled };
  }

  if (String(disable)) {
    return { disabled: disable };
  }

  return { disabled: false };
};

// 重置关联字段的数据
const relationShowItems = computed(() =>
  props.options
    .filter((option) => option?.relationShow?.length === 2)
    .map((option) => ({
      key: option.relationShow[0],
      type: Array.isArray(option.treeOptions) ? [] : '',
      name: option.name
    }))
);

relationShowItems.value.forEach((item) => {
  watch(
    () => formState.value[item.key],
    () => {
      // @wenTODO 之后需要判断变化的是那个字段，然后重置多个字段
      formState.value[item.name] = item.type;
    }
  );
});

// 抛出组件的属性和方法
defineExpose({
  validate,
  resetFields,
  formState
});
</script>

<template>
  <a-form :model="formState">
    <a-row :gutter="[16, 16]">
      <template v-for="option in options">
        <a-col
          :key="option.name"
          :span="handleBisection(option.bisection)"
          v-if="handelRelationShow(option)"
        >
          <a-form-item
            :label="option.label"
            class="form-item"
            v-bind="handleBind(option)"
          >
            <a-range-picker
              v-if="option.inputType === 'dateRangePicker'"
              v-model:value="formState[option.name]"
              v-bind="handleDisable(option.disabled)"
              style="width: 100%"
              allow-clear
            />

            <a-date-picker
              v-else-if="option.inputType === 'datePicker'"
              v-model:value="formState[option.name]"
              v-bind="handleDisable(option.disabled)"
              style="width: 100%"
              allow-clear
            />

            <a-tree-select
              v-else-if="option.inputType === 'treeSelect'"
              v-model:value="formState[option.name]"
              :tree-data="option.treeOptions"
              :field-names="option.fieldNames"
              :placeholder="`请选择${option.label}`"
              v-bind="handleDisable(option.disabled)"
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
              v-bind="handleDisable(option.disabled)"
              style="width: 100%"
              show-arrow
              :show-search="false"
              allow-clear
            />

            <a-radio-group
              v-else-if="option.inputType === 'radio'"
              v-model:value="formState[option.name]"
              :options="option.treeOptions ?? dictObjs[option.selectType]"
              v-bind="handleDisable(option.disabled)"
            />

            <template v-else-if="option.inputType === 'treeCheck'">
              <a-checkbox-group
                class="checkbox-margin"
                v-model:value="checkboxVal"
                :options="treeCheckOptions"
                @change="handleCheckboxChange"
              />
              <a-tree
                class="tree-wrap"
                :tree-data="option.treeOptions ?? dictObjs[option.selectType]"
                :field-names="option.fieldNames"
                v-model:expandedKeys="expandedKeys"
                v-model:checkedKeys="formState[option.name]"
                :check-strictly="checkStrictly"
                :height="200"
                block-node
                checkable
              />
            </template>

            <a-textarea
              v-else-if="option.inputType === 'textarea'"
              v-model:value="formState[option.name]"
              :placeholder="`请输入${option.label}`"
              v-bind="handleDisable(option.disabled)"
              style="width: 100%"
              allow-clear
            />

            <a-input-password
              v-else-if="option.inputType === 'inputPassword'"
              v-model:value="formState[option.name]"
              :placeholder="`请输入${option.label}`"
              v-bind="handleDisable(option.disabled)"
              style="width: 100%"
              allow-clear
              autocomplete
            />

            <a-input-number
              v-else-if="option.inputType === 'inputNumber'"
              v-model:value="formState[option.name]"
              :placeholder="`请输入${option.label}`"
              v-bind="handleDisable(option.disabled)"
              style="width: 100%"
              allow-clear
            />

            <a-input
              v-else
              v-model:value="formState[option.name]"
              :placeholder="`请输入${option.label}`"
              v-bind="handleDisable(option.disabled)"
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
.form-item {
  margin-bottom: 0;
}

.checkbox-margin {
  margin: 6px 0;
}

:deep(.tree-wrap) {
  padding: 4px 0;
  border: 1px solid #ccc;
}
</style>
