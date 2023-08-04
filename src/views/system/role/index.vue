<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal, type TableColumnsType } from 'ant-design-vue';
import { computed, createVNode, h, inject, onMounted, ref } from 'vue';

import { treeSelect } from '@/apis/system/menu';
import { addRole, delRole, listRole, updateRole } from '@/apis/system/role';
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
  { label: '角色名称', name: 'roleName' },
  { label: '权限字符', name: 'roleKey' },
  {
    label: '状态',
    name: 'status',
    inputType: 'select',
    selectType: 'sys_normal_disable'
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
    title: '角色编号',
    dataIndex: 'roleId',
    key: 'roleId'
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
    key: 'roleName'
  },
  {
    title: '权限字符',
    dataIndex: 'roleKey',
    key: 'roleKey'
  },
  {
    title: '显示顺序',
    dataIndex: 'roleSort',
    key: 'roleSort'
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

const {
  dataSource,
  formStatus,
  rowKeys,
  paginationIndicator,
  handleChangeSelection,
  handleChange,
  getList,
  searchCb
} = useTableRequest(listRole);

// 重置检索表单
const resetCb = (): void => {
  formStatus.value = {};
  getList();
};

// 表单事件操作
const optType = ref<OptType>('add');
const defaultValue = ref<unknown>({});
const handleActionTables = (type: OptType, record?: unknown = {}): void => {
  console.log(record, 'record');
  optType.value = type;
  if (type === 'add') {
    defaultValue.value = {};
    options.value = defaultOptions;
    open.value = true;
    void vwFormRef.value?.resetFields();
  }

  if (type === 'edit') {
    defaultValue.value = record;
    open.value = true;
    void vwFormRef.value?.resetFields();
  }

  if (type === 'delete') {
    let { roleId, index } = record;
    defaultValue.value.roleId = roleId;
    if (!roleId) {
      if (rowKeys.value.length === 0) {
        void message.warning('请选中至少一条数据进行操作');
        return;
      }
      roleId = rowKeys.value.join(',');
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
        delRole(roleId).then(() => {
          getList();
        });
      }
    });
  }

  if (type === 'export') {
    download(
      'system/role/export',
      {
        ...formStatus
      },
      `role_${+new Date()}.xlsx`
    );
  }
};

// modal 数据
const vwFormRef = ref();
const open = ref<boolean>(false);
const defaultOptions: IFormItem[] = [
  {
    label: '角色名称',
    name: 'roleName'
  },
  {
    label: '权限字符',
    name: 'roleKey'
  },
  {
    label: '角色顺序',
    name: 'roleSort',
    inputType: 'inputNumber'
  },
  {
    label: '状态',
    name: 'status',
    inputType: 'radio',
    selectType: 'sys_normal_disable'
  },
  {
    label: '菜单权限',
    name: 'menuIds',
    inputType: 'treeCheck',
    fieldNames: {
      title: 'label',
      key: 'id',
      children: 'children'
    },
    treeOptions: [],
    bisection: 1
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
  roleName: [{ required: true, message: '角色名称不能为空' }],
  roleKey: [{ required: true, message: '权限字符不能为空' }],
  roleSort: [{ required: true, message: '角色顺序不能为空' }]
});

const handleMenuTree = (): void => {
  treeSelect().then((res) => {
    const [gotIt] = options.value.filter(
      (option) => option.inputType === 'treeCheck'
    );
    gotIt.treeOptions = res.data;
  });
};

/**
 * 新增/修改提交
 * */
const modalOk = (): void => {
  void vwFormRef.value?.validate().then(() => {
    let cb = addRole;
    const params = vwFormRef.value.formState;
    if (optType.value === 'edit') {
      params.roleId = defaultValue.value.roleId;
      cb = updateRole;
    }
    cb(params).then(() => {
      open.value = false;
      getList();
    });
  });
};

onMounted(() => {
  handleMenuTree();
});
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
    row-key="roleId"
    :row-selection="{
      onChange: handleChangeSelection,
      getCheckboxProps: (record) => ({
        disabled: record.roleId === 1
      })
    }"
    @change="handleChange"
  >
    <template #bodyCell="{ column, index, text, record }">
      <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
      <template v-if="column.dataIndex === 'status'">
        <dict-tag :value="text" :options="dictObjs['sys_normal_disable']" />
      </template>
      <template v-if="column.dataIndex === 'action'">
        <action-table
          v-if="record.roleId !== 1"
          btn-size="small"
          btn-type="link"
          :options="['edit', 'delete', 'dataRights', 'assignUsers']"
          @click-cb="
            (type) => {
              handleActionTables(type, { ...record, index: index + 1 });
            }
          "
        />
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="open" title="新增角色" :width="600" @ok="modalOk">
    <v-w-form
      ref="vwFormRef"
      v-if="open"
      :options="options"
      :rules="rules"
      :default-value="defaultValue"
    />
  </a-modal>
</template>

<style lang="less" scoped>
.form-item-margin {
  margin: 16px 0;
}
</style>
