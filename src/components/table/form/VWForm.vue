<!--form子组件初始化值时 存在时序问题-->
<script setup lang="ts">
import { Form } from 'ant-design-vue';
import { computed, inject, reactive, ref, watch } from 'vue';

import VWIconFont from '@/components/icon-font/VWIconFont.vue';
import keyProvide from '@/constants/keyProvide';
import { type IFormItem } from '@/types/opts';

const props = withDefaults(
  defineProps<{
    // 表单结构
    layout?: 'horizontal' | 'vertical' | 'inline';
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
    layout: 'horizontal',
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
const defaultValueKeys = Object.keys(props.defaultValue ?? {});
// 新增
if (keys.length === 0) {
  props.options.forEach((option) => {
    const key = option.name;
    defaultState[key] = null;

    if (option.inputType === 'radio') {
      if (option.defaultValue) {
        defaultState[key] = option.defaultValue;
      } else {
        defaultState[key] = '0';
      }
    }

    // 多选模式下 需要初始化为数组
    if (option.selectMode) {
      defaultState[key] = [];
    }
  });
} else {
  // 编辑处理 或者 部分初始化处理
  props.options.forEach((option) => {
    const { name: key, inputType, selectMode, defaultValue } = option;
    if (defaultValueKeys.includes(key)) {
      defaultState[key] = props.defaultValue[key];
    } else {
      if (props.defaultValue[key]) {
        defaultState[key] = props.defaultValue[key];
      } else {
        if (defaultValue) {
          defaultState[key] = defaultValue;
        } else {
          defaultState[key] = null;

          if (inputType === 'radio') {
            defaultState[key] = '0';
          }

          // 多选模式下 需要初始化为数组
          if (selectMode) {
            defaultState[key] = [];
          }
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

  if (props.layout === 'vertical') {
    return {};
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

  // 是数组 && 长度为2 && 数组里面的元素不是数组
  if (
    Array.isArray(option?.relationShow) &&
    option?.relationShow.length === 2 &&
    !Array.isArray(option?.relationShow[0])
  ) {
    if (!relationShow.value.some((rs) => rs.name === option.name)) {
      relationShow.value.push(option);
    }
    const [key, val] = option?.relationShow;
    return formState.value[key] === val;
  }

  // 是数组 && 数组中每一个元素都是数组
  if (
    Array.isArray(option?.relationShow) &&
    option?.relationShow?.every((rs) => Array.isArray(rs))
  ) {
    if (!relationShow.value.some((rs) => rs.name === option.name)) {
      relationShow.value.push(option);
    }

    const booleans = [];
    option?.relationShow.forEach((rs) => {
      const [key, val] = rs;
      booleans.push(formState.value[key] === val);
    });

    return booleans.some((bool) => bool === true);
  }

  return false;
};

/**
 * 处理查看时，禁用表单
 * */
const handleDisable = (disable?: boolean): boolean => {
  if (props.disabled) {
    return { disabled: props.disabled };
  }

  if (disable) {
    return { disabled: disable };
  }

  return { disabled: false };
};

// 重置关联字段的数据
const relationShowItems = computed(() => {
  const arr = [];
  props.options
    .filter(
      (option) =>
        option?.relationShow?.length === 2 ||
        (option?.relationShow?.length > 0 &&
          option?.relationShow?.every((rs) => rs.length === 2))
    )
    .forEach((option) => {
      if (Array.isArray(option.relationShow[0])) {
        option.relationShow.forEach((rs) => {
          if (
            !arr.some((item) => item.name === option.name && item.key === rs[0])
          ) {
            arr.push({
              key: rs[0],
              type: Array.isArray(option.treeOptions) ? [] : '',
              name: option.name,
              raw: option
            });
          }
        });
      } else {
        if (
          !arr.some(
            (item) =>
              item.name === option.name && item.key === option.relationShow[0]
          )
        ) {
          arr.push({
            key: option.relationShow[0],
            type: Array.isArray(option.treeOptions) ? [] : '',
            name: option.name,
            raw: option
          });
        }
      }
    });
  return arr;
});

relationShowItems.value.forEach((item) => {
  watch(
    () => formState.value[item.key],
    () => {
      const {
        raw: { defaultValue, inputType, selectMode, name: key }
      } = item;
      if (keys.length === 0) {
        formState.value[key] = null;

        if (inputType === 'radio') {
          if (defaultValue) {
            formState.value[key] = defaultValue;
          } else {
            formState.value[key] = '0';
          }
        }

        // 多选模式下 需要初始化为数组
        if (selectMode) {
          formState.value[key] = [];
        }
      } else {
        if (defaultValueKeys.includes(key)) {
          formState.value[key] = props.defaultValue[key];
        } else {
          if (props.defaultValue[key]) {
            formState.value[key] = props.defaultValue[key];
          } else {
            if (defaultValue) {
              formState.value[key] = defaultValue;
            } else {
              defaultState[key] = null;

              if (inputType === 'radio') {
                defaultState[key] = '0';
              }

              // 多选模式下 需要初始化为数组
              if (selectMode) {
                defaultState[key] = [];
              }
            }
          }
        }
      }
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
  <a-form :model="formState" :layout="layout">
    <a-row :gutter="[16, 16]">
      <template v-for="option in options">
        <a-col
          :key="option.name"
          :span="handleBisection(option.bisection)"
          v-if="handelRelationShow && handelRelationShow(option)"
        >
          <a-form-item class="form-item" v-bind="handleBind(option)">
            <!--提示框-->
            <template #label>
              <a-tooltip v-if="option?.tooltipDesc">
                <template #title>
                  {{ option?.tooltipDesc }}
                </template>
                <question-circle-outlined class="right-icon" />
              </a-tooltip>
              {{ option.label }}
            </template>
            <!--日期范围选择-->
            <a-range-picker
              v-if="option.inputType === 'dateRangePicker'"
              v-model:value="formState[option.name]"
              v-bind="handleDisable(option.disabled)"
              style="width: 100%"
              allow-clear
            />
            <!--日期选择-->
            <a-date-picker
              v-else-if="option.inputType === 'datePicker'"
              v-model:value="formState[option.name]"
              v-bind="handleDisable(option.disabled)"
              style="width: 100%"
              allow-clear
            />
            <!--树形下拉-->
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
            <!--下拉框-->
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
            <!--带图标的select-->
            <a-select
              v-else-if="option.inputType === 'selectIcon'"
              :mode="option.selectMode"
              :field-names="option.fieldNames"
              v-model:value="formState[option.name]"
              :placeholder="`请选择${option.label}`"
              v-bind="handleDisable(option.disabled)"
              style="width: 100%"
              show-arrow
              :show-search="false"
              allow-clear
            >
              <a-select-option
                v-for="option in option.treeOptions ??
                dictObjs[option.selectType]"
                :value="option.value"
                :key="option.value"
              >
                <v-w-icon-font :type="option.value" />
                {{ option.label }}
              </a-select-option>
            </a-select>
            <!--单选框-->
            <a-radio-group
              v-else-if="option.inputType === 'radio'"
              v-model:value="formState[option.name]"
              :options="option.treeOptions ?? dictObjs[option.selectType]"
              v-bind="handleDisable(option.disabled)"
            />
            <!--树形check选择-->
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
            <!--文本域-->
            <a-textarea
              v-else-if="option.inputType === 'textarea'"
              v-model:value="formState[option.name]"
              :placeholder="`请输入${option.label}`"
              v-bind="handleDisable(option.disabled)"
              style="width: 100%"
              allow-clear
            />
            <!--密码输入-->
            <a-input-password
              v-else-if="option.inputType === 'inputPassword'"
              v-model:value="formState[option.name]"
              :placeholder="`请输入${option.label}`"
              v-bind="handleDisable(option.disabled)"
              style="width: 100%"
              allow-clear
              autocomplete
            />
            <!--数字输入-->
            <a-input-number
              v-else-if="option.inputType === 'inputNumber'"
              v-model:value="formState[option.name]"
              :placeholder="`请输入${option.label}`"
              v-bind="handleDisable(option.disabled)"
              style="width: 100%"
              allow-clear
            />
            <!--普通输入框-->
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

:deep(.right-icon) {
  margin-right: 4px;
  font-size: 8px;
}

:deep(.anticon) {
  font-size: 8px !important;
}

:deep(.ant-select-single.ant-select-open .ant-select-selection-item .anticon) {
  color: rgb(0 0 0 / 25%) !important;
}
</style>
