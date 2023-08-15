<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal, type TableColumnsType } from 'ant-design-vue';
import { computed, createVNode, h, inject, ref } from 'vue';

import {
  addDept,
  delDept,
  getDept,
  listDept,
  updateDept
} from '@/apis/system/dept';
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

// 搜索表单项
const searchOptions = ref<IOptSearch[]>([
  { label: '部门名称', name: 'deptName' },
  {
    label: '状态',
    name: 'status',
    inputType: 'select',
    selectType: 'sys_normal_disable'
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
    title: '部门名称',
    dataIndex: 'deptName',
    key: 'deptName'
  },
  {
    title: '顺序',
    dataIndex: 'orderNum',
    key: 'orderNum'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
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

const { dataSource, formStatus, getList, searchCb } = useTableRequest(
  listDept,
  'data',
  {},
  false,
  true,
  { value: 'deptId' }
);

// 重置检索表单
const resetCb = (): void => {
  formStatus.value = {};
  getList();
};

const optType = ref<OptType>('add');
const defaultValue = ref<unknown>({});
// modal 数据
const vwFormRef = ref();
const titleRef = ref('新增岗位');
const open = ref<boolean>(false);

// 新增角色数据结构
const defaultOptions: IFormItem[] = [
  {
    label: '岗位名称',
    name: 'postName'
  },
  {
    label: '岗位编码',
    name: 'postCode'
  },
  {
    label: '岗位顺序',
    name: 'postSort',
    inputType: 'inputNumber'
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
  postName: [{ required: true, message: '岗位名称不能为空' }],
  postCode: [{ required: true, message: '岗位编码不能为空' }],
  postSort: [{ required: true, message: '岗位顺序不能为空' }]
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
    titleRef.value = '修改岗位';
    getDept(record.deptId).then((res) => {
      defaultValue.value = { ...res.data, ...defaultValue.value };
      open.value = true;
      void vwFormRef.value?.resetFields();
    });
  }

  if (type === 'delete') {
    const { deptId, index } = record;
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
        return delDept(deptId).then(() => {
          getList();
        });
      }
    });
  }
};

/**
 * 新增/修改提交
 * */
const modalOk = (): void => {
  void vwFormRef.value?.validate().then(() => {
    let cb = addDept;
    const params = vwFormRef.value.formState;
    if (optType.value === 'edit') {
      params.deptId = defaultValue.value.deptId;
      cb = updateDept;
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
        :options="['add']"
        :row-gutter="16"
        @click-cb="handleActionTables"
      />
    </a-col>
  </a-row>
  <a-table
    :columns="columnsGetters"
    :data-source="dataSource"
    row-key="deptId"
    :pagination="false"
  >
    <template #bodyCell="{ column, index, text, record }">
      <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
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
