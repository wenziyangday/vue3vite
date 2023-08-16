<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal, type TableColumnsType } from 'ant-design-vue';
import { computed, createVNode, h, inject, ref } from 'vue';

import {
  addType,
  delType,
  getType,
  listType,
  refreshCache,
  updateType
} from '@/apis/system/dict/type';
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
dictInject(['sys_normal_disable']);
const dictObjs = inject(keyProvide.dictObjs);
const download = inject(keyProvide.$download);

// 搜索表单项
const searchOptions = ref<IOptSearch[]>([
  { label: '字典名称', name: 'dictName' },
  { label: '字典类型', name: 'dictType' },
  {
    label: '状态',
    name: 'status',
    inputType: 'select',
    selectType: 'sys_normal_disable'
  },
  {
    label: '创建时间',
    name: 'createTime',
    inputType: 'dateRangePicker'
  }
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
    title: '字典名称',
    dataIndex: 'dictName',
    key: 'dictName'
  },
  {
    title: '字典类型',
    dataIndex: 'dictType',
    key: 'dictType'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark'
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
} = useTableRequest(listType);

// 重置检索表单
const resetCb = (): void => {
  formStatus.value = {};
  getList();
};

const optType = ref<OptType>('add');
const defaultValue = ref<unknown>({});
// modal 数据
const vwFormRef = ref();
const titleRef = ref('新增字典');
const open = ref<boolean>(false);

// 新增数据结构
const defaultOptions: IFormItem[] = [
  {
    label: '字典名称',
    name: 'dictName'
  },
  {
    label: '字典类型',
    name: 'dictType'
  },
  {
    label: '状态',
    name: 'status',
    inputType: 'radio',
    selectType: 'sys_normal_disable'
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
  dictName: [{ required: true, message: '字典名称不能为空' }],
  dictType: [{ required: true, message: '字典类型不能为空' }]
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
    titleRef.value = '修改字典';
    getType(record.dictId).then((res) => {
      defaultValue.value = { ...res.data, ...defaultValue.value };
      open.value = true;
      void vwFormRef.value?.resetFields();
    });
  }

  if (type === 'delete') {
    let { dictId, index } = record;
    if (dictId) {
      if (rowKeys.value.length === 0) {
        void message.warning('请选中至少一条数据进行操作');
        return;
      }
      dictId = rowKeys.value.join(',');
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
        return delType(dictId).then(() => {
          getList();
        });
      }
    });
  }

  if (type === 'export') {
    download('system/dict/type/export', formStatus, `dict_${+new Date()}.xlsx`);
  }
};

/**
 * 新增/修改提交
 * */
const modalOk = (): void => {
  void vwFormRef.value?.validate().then(() => {
    let cb = addType;
    const params = vwFormRef.value.formState;
    if (optType.value === 'edit') {
      params.dictId = defaultValue.value.dictId;
      cb = updateType;
    }

    cb(params).then(() => {
      open.value = false;
      getList();
    });
  });
};

const refresh = (): void => {
  refreshCache();
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
      >
        <template #opt="opt">
          <a-col :span="1.5">
            <a-button :size="opt.btnSize" :type="opt.btnType" @click="refresh">
              <template #icon>
                <sync-outlined />
              </template>
              <span style="margin-left: 4px">刷新缓存</span>
            </a-button>
          </a-col>
        </template>
      </action-table>
    </a-col>
  </a-row>
  <a-table
    :columns="columnsGetters"
    :data-source="dataSource"
    :pagination="paginationIndicator"
    row-key="dictId"
    :row-selection="{
      onChange: handleChangeSelection
    }"
    @change="handleChange"
  >
    <template #bodyCell="{ column, index, text, record }">
      <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
      <template v-if="column.dataIndex === 'dictType'">
        <router-link :to="`/system/dict-data/index/${record.dictId}`"
          >{{ text }}
        </router-link>
      </template>
      <template v-if="column.dataIndex === 'status'">
        <dict-tag :value="text" :options="dictObjs['sys_normal_disable']" />
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
