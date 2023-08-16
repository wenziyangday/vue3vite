<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal, type TableColumnsType } from 'ant-design-vue';
import { computed, createVNode, h, inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { roleMenuTreeselect, treeSelect } from '@/apis/system/menu';
import {
  addRole,
  dataScope,
  delRole,
  deptTreeSelect,
  getRole,
  listRole,
  updateRole
} from '@/apis/system/role';
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

const router = useRouter();

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
const handleActionTables = async (
  type: OptType,
  record?: unknown = {}
): void => {
  optType.value = type;
  if (type === 'add') {
    titleRef.value = '新增角色';
    // 新增初始化 add 权限树
    const [gotIt] = options.value.filter(
      (option) => option.inputType === 'treeCheck'
    );
    gotIt.treeOptions = defaultTreeOption.value;

    // 重置基础数据
    defaultValue.value = {};
    options.value = defaultOptions;
    open.value = true;
    void vwFormRef.value?.resetFields();
  }

  if (type === 'edit') {
    titleRef.value = '修改角色';
    await getRoleMenuTreeSelect(record.roleId);
    getRole(record.roleId).then((res) => {
      defaultValue.value = { ...res.data, ...defaultValue.value };
      open.value = true;
      void vwFormRef.value?.resetFields();
    });
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
        return delRole(roleId).then(() => {
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

  if (type === 'dataRights') {
    titleRef.value = '分配数据权限';
    dictInject(['sys_rights_scope']);
    defaultValue.value = record;
    await handleDataScope(record);
    const { roleId } = record;
    defaultValue.value.roleId = roleId;
    open.value = true;
  }

  if (type === 'assignUsers') {
    const { roleId } = record;
    void router.push(`/system/role-auth/user/${roleId}`);
  }
};

// modal 数据
const vwFormRef = ref();
const titleRef = ref('新增角色');
const defaultTreeOption = ref([]);
const open = ref<boolean>(false);
// 新增数据结构
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
// 数据权限分配
const dataRights = ref<IFormItem[]>([
  {
    label: '角色名称',
    name: 'roleName',
    disabled: true
  },
  {
    label: '权限字符',
    name: 'roleKey',
    disabled: true
  },
  {
    label: '权限范围',
    name: 'dataScope',
    inputType: 'select',
    selectType: 'sys_rights_scope'
  },
  {
    label: '数据权限',
    name: 'deptIds',
    inputType: 'treeCheck',
    fieldNames: {
      title: 'label',
      key: 'id',
      children: 'children'
    },
    treeOptions: [],
    bisection: 1,
    relationShow: ['dataScope', '2']
  }
]);

const handleMenuTree = (): void => {
  treeSelect().then((res) => {
    defaultTreeOption.value = res.data;
  });
};

/** 根据角色ID查询菜单树结构 */
const getRoleMenuTreeSelect = (roleId): Promise => {
  return roleMenuTreeselect(roleId).then((res) => {
    const [gotIt] = options.value.filter(
      (option) => option.inputType === 'treeCheck'
    );
    gotIt.treeOptions = res.menus;
    defaultValue.value.menuIds = res.checkedKeys ?? [];
    return res;
  });
};

// 获取部门
const handleDataScope = (row): Promise => {
  return deptTreeSelect(row.roleId).then((res) => {
    const [gotIt] = dataRights.value.filter(
      (option) => option.inputType === 'treeCheck'
    );
    gotIt.treeOptions = res.depts;
    defaultValue.value.deptIds = res.checkedKeys ?? [];
    return res;
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

    if (optType.value === 'dataRights') {
      params.roleId = defaultValue.value.roleId;
      cb = dataScope;
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
  <a-modal v-model:open="open" :title="titleRef" :width="600" @ok="modalOk">
    <v-w-form
      ref="vwFormRef"
      v-if="open && ['edit', 'add'].includes(optType)"
      :options="options"
      :rules="rules"
      :default-value="defaultValue"
    />
    <v-w-form
      ref="vwFormRef"
      :options="dataRights"
      v-if="open && optType === 'dataRights'"
      :default-value="defaultValue"
    />
  </a-modal>
</template>
