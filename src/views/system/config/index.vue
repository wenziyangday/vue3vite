<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal, type TableColumnsType } from 'ant-design-vue';
import { computed, createVNode, h, inject, ref } from 'vue';

import {
  addConfig,
  delConfig,
  getConfig,
  listConfig,
  updateConfig
} from '@/apis/system/config';
import ActionTable from '@/components/action-table/ActionTable.vue';
import ConfirmContent from '@/components/confirm-content/ConfirmContent.vue';
import DictTag from '@/components/dict-tag/DictTag.vue';
import VWForm from '@/components/table/form/VWForm.vue';
import Search from '@/components/table/search/Search.vue';
import keyProvide from '@/constants/keyProvide';
import useTableRequest from '@/plugins/hooks/useTableRequest';
import { type IFormItem, type IOptSearch, type OptType } from '@/types/opts';

/**
 * 全局方法使用
 * */
const dictInject = inject(keyProvide.$getDict);
dictInject(['sys_yes_no']);
const dictObjs = inject(keyProvide.dictObjs);
const download = inject(keyProvide.$download);

// 搜索表单项
const searchOptions = ref<IOptSearch[]>([
  { label: '参数名称', name: 'configName' },
  { label: '参数键名', name: 'configKey' },
  {
    label: '系统内置',
    name: 'configType',
    inputType: 'select',
    selectType: 'sys_yes_no'
  },
  { label: '创建时间', name: 'createTime', inputType: 'dateRangePicker' }
]);

/**
 * th 表头
 * */
const columns = ref<TableColumnsType[]>([
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index'
  },
  {
    title: '参数名称',
    dataIndex: 'configName',
    key: 'configName'
  },
  {
    title: '参数键名',
    dataIndex: 'configKey',
    key: 'configKey'
  },
  {
    title: '参数键值',
    dataIndex: 'configValue',
    key: 'configValue'
  },
  {
    title: '系统内置',
    dataIndex: 'configType',
    key: 'configType'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action'
  }
]);
const columnsGetters = computed(() =>
  columns.value.map((column) => ({
    ...column,
    align: 'center'
  }))
);

const {
  dataSource,
  formStatus,
  rowKeys,
  paginationIndicator,
  handleChangeSelection,
  handleChange,
  getList,
  searchCb
} = useTableRequest(listConfig);

// 重置检索表单
const resetCb = (): void => {
  formStatus.value = {};
  getList();
};

const optType = ref<OptType>('add');
const defaultValue = ref<unknown>({});
// modal 数据
const vwFormRef = ref();
const titleRef = ref('新增参数');
const open = ref<boolean>(false);

// 新增数据结构
const defaultOptions: IFormItem[] = [
  {
    label: '参数名称',
    name: 'configName'
  },
  {
    label: '参数键名',
    name: 'configKey'
  },
  {
    label: '参数键值',
    name: 'configValue'
  },
  {
    label: '系统内置',
    name: 'configType',
    inputType: 'radio',
    selectType: 'sys_yes_no',
    defaultValue: 'Y'
  },
  {
    label: '备注',
    name: 'remark',
    inputType: 'textarea',
    bisection: 1
  }
];
const options = ref<IFormItem[]>(defaultOptions);
const rules = ref({
  configName: [{ required: true, message: '参数名称不能为空' }],
  configKey: [{ required: true, message: '参数键名不能为空' }],
  configValue: [{ required: true, message: '参数键值不能为空' }]
});
const handleActionTables = async (
  type: OptType,
  record?: unknown = {}
): void => {
  optType.value = type;
  if (type === 'add') {
    open.value = true;
    defaultValue.value = {};
    void vwFormRef.value?.resetFields();
  }

  if (type === 'edit') {
    titleRef.value = '修改参数';
    getConfig(record.configId).then((res) => {
      defaultValue.value = { ...res.data, ...defaultValue.value };
      open.value = true;
      void vwFormRef.value?.resetFields();
    });
  }

  if (type === 'delete') {
    let { configId, index } = record;
    if (!configId) {
      if (rowKeys.value.length === 0) {
        void message.warning('请选中至少一条数据进行操作');
        return;
      }
      configId = rowKeys.value.join(',');
    }
    Modal.confirm({
      title: '系统提示',
      closable: true,
      icon: () => {},
      content: h('div', [
        createVNode(ExclamationCircleOutlined),
        createVNode(ConfirmContent, {
          msg: `${index ?? '多条'}`,
          icon: 'delete-outlined'
        })
      ]),
      okText: '确认',
      onOk: () => {
        return delConfig(configId).then(() => {
          getList();
        });
      }
    });
  }

  if (type === 'export') {
    download('system/config/export', formStatus, `config_${+new Date()}.xlsx`);
  }
};

/**
 * 新增/修改提交
 * */
const modalOk = (): void => {
  void vwFormRef.value?.validate().then(() => {
    let cb = addConfig;
    const params = vwFormRef.value.formState;
    if (optType.value === 'edit') {
      params.configId = defaultValue.value.configId;
      cb = updateConfig;
    }

    cb(params).then(() => {
      open.value = false;
      getList();
    });
  });
};
</script>

<template>
  <search :options="searchOptions" @search-cb="searchCb" @reset-cb="resetCb" />
  <a-row class="form-item-margin">
    <a-col>
      <action-table
        :options="['add', 'delete', 'export']"
        :row-gutter="16"
        :dropdown-length="4"
        @click-cb="handleActionTables"
      />
    </a-col>
  </a-row>
  <a-table
    :columns="columnsGetters"
    :data-source="dataSource"
    :pagination="paginationIndicator"
    row-key="configId"
    :row-selection="{
      onChange: handleChangeSelection
    }"
    @change="handleChange"
  >
    <template #bodyCell="{ column, index, text, record }">
      <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
      <template v-if="column.dataIndex === 'configType'">
        <dict-tag :value="text" :options="dictObjs['sys_yes_no']" />
      </template>
      <template v-if="column.dataIndex === 'action'">
        <action-table
          btn-size="small"
          btn-type="link"
          :options="['edit', 'delete']"
          @click-cb="
            (type) => {
              handleActionTables(type, { ...record, index: index + 1 });
            }
          "
        />
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="open" :title="titleRef" :width="600" @ok="modalOk">
    <v-w-form
      ref="vwFormRef"
      v-if="open"
      :options="options"
      :rules="rules"
      :default-value="defaultValue"
    />
  </a-modal>
</template>
