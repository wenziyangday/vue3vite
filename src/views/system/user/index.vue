<script setup lang="ts">
import { type TableColumnsType } from 'ant-design-vue';
import { computed, inject, onMounted, reactive, ref } from 'vue';

import {
  addUser,
  deptTreeSelect,
  getUser,
  listUser,
  updateUser
} from '@/apis/system/user';
import ActionTable from '@/components/action-table/ActionTable.vue';
import DictTag from '@/components/dict-tag/DictTag.vue';
import VWForm from '@/components/table/form/VWForm.vue';
import Search from '@/components/table/search/Search.vue';
import keyProvide from '@/constants/keyProvide';
import useTableRequest from '@/plugins/hooks/useTableRequest';
import { type IFormItem, type IOptSearch } from '@/types/opts';

/**
 * 全局获取字典值
 * */
const dictInject = inject(keyProvide.$getDict);
dictInject(['sys_normal_disable']);
const dictObjs = inject(keyProvide.dictObjs);

/**
 * 检索 配置
 * */
const searchOptions = ref<IOptSearch[]>([
  { label: '用户名称', name: 'userName' },
  { label: '手机号码', name: 'phonenumber' },
  {
    label: '状态',
    name: 'status',
    inputType: 'select',
    selectType: 'sys_normal_disable'
  },
  { label: '创建时间', name: 'createTime', inputType: 'dateRangePicker' }
]);

// 左侧树结构相关
const filterTreeInput = ref<string>();
const treeData = ref([]);

const filterTreeNode = (vnode: unknown): void => {
  if (!filterTreeInput.value) {
    return false;
  }
  return vnode.label.indexOf(filterTreeInput.value) > -1;
};

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
    title: '用户名称',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '用户昵称',
    dataIndex: 'nickName',
    key: 'nickName'
  },
  {
    title: '部门',
    dataIndex: ['dept', 'deptName'],
    key: 'dept'
  },
  {
    title: '手机号码',
    dataIndex: 'phonenumber',
    key: 'phoneNumber'
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
} = useTableRequest(listUser);

const checkedKeys = ref<any[]>([]);

// 树的选择事件
const handleTreeSelect = (selectedKeys): void => {
  const [deptId] = selectedKeys;
  formStatus.value.deptId = deptId;
  getList();
};

/**
 * 获取部门树
 * */
const handleDeptTreeSelect = (): void => {
  deptTreeSelect().then((res) => {
    treeData.value = res.data;
    const [gotIt] = options.value.filter((option) => option.name === 'deptId');
    gotIt.treeOptions = res.data;
  });
};

// 重置检索表单
const resetCb = (): void => {
  filterTreeInput.value = null;
  formStatus.value = {};
  checkedKeys.value = [];
  getList();
};

// modal 新增
const open = ref<boolean>(false);
const title = ref<string>('添加用户');
const userInfo = ref<{
  posts: [];
  roles: [];
}>({});
const vwFormRef = ref();
const optType = ref<string>('add');
const defaultValue = ref<Record<string, unknown>>({});
const options = ref<IFormItem[]>([
  {
    label: '用户昵称',
    name: 'nickName'
  },
  {
    label: '归属部门',
    name: 'deptId',
    inputType: 'treeSelect',
    treeOptions: [],
    fieldNames: {
      value: 'id',
      label: 'label',
      children: 'children'
    }
  },
  {
    label: '手机号码',
    name: 'phonenumber'
  },
  {
    label: '邮箱',
    name: 'email'
  },
  {
    label: '用户名称',
    name: 'userName'
  },
  {
    label: '用户密码',
    name: 'password',
    inputType: 'inputPassword'
  },
  {
    label: '用户性别',
    name: 'sex',
    inputType: 'select',
    selectType: 'sys_user_sex'
  },
  {
    label: '状态',
    name: 'status',
    inputType: 'radio',
    selectType: 'sys_normal_disable'
  },
  {
    label: '岗位',
    name: 'postIds',
    inputType: 'select',
    treeOptions: [],
    selectMode: 'multiple',
    fieldNames: {
      value: 'postId',
      label: 'postName',
      children: 'children'
    }
  },
  {
    label: '角色',
    name: 'roleIds',
    inputType: 'select',
    treeOptions: [],
    selectMode: 'multiple',
    fieldNames: {
      value: 'roleId',
      label: 'roleName',
      children: 'children'
    }
  },
  {
    label: '备注',
    name: 'remark',
    inputType: 'textarea'
  }
]);

const rules = reactive({
  nickName: [{ required: true, message: '用户昵称不能为空' }],
  deptId: [{ required: true, message: '归属部门不能为空' }]
});

/**
 * 获取用户角色，职位列表
 * */
const handleUserInfo = async (): void => {
  const { posts = [], roles = [] } = userInfo.value;
  if (posts.length === 0 || roles.length === 0) {
    const res = await getUser('');
    userInfo.value.posts = res.posts;
    userInfo.value.roles = res.roles;
    const [gotItPost, gotItRole] = options.value.filter(
      (option) => option.name === 'postIds' || option.name === 'roleIds'
    );
    gotItPost.treeOptions = res.posts;
    gotItRole.treeOptions = res.roles;
  }
};

// 表单事件操作
const handleActionTables = (type: string, record?: unknown): void => {
  optType.value = type;

  if (type === 'add' || type === 'edit') {
    open.value = true;
    handleUserInfo();
  }

  if (type === 'add') {
    defaultValue.value = {};
    void vwFormRef.value?.resetFields();
  }

  if (type === 'edit') {
    // 设置一个default props
    defaultValue.value = record;
  }
};

/**
 * 新增/修改提交
 * */
const modalOk = (): void => {
  void vwFormRef.value?.validate().then(() => {
    let cb = addUser;
    const params = vwFormRef.value.formState;
    if (optType.value === 'edit') {
      params.userId = defaultValue.value.userId;
      cb = updateUser;
    }
    cb(params).then(() => {
      open.value = false;
      getList();
    });
  });
};

onMounted(() => {
  handleDeptTreeSelect();
});
</script>

<template>
  <a-row :gutter="[16, 16]">
    <a-col :span="4">
      <a-form>
        <a-form-item>
          <a-input
            v-model:value="filterTreeInput"
            placeholder="请输入部门名称"
            allow-clear
          >
            <template #prefix>
              <search-outlined />
            </template>
          </a-input>
        </a-form-item>
      </a-form>
      <a-tree
        v-if="treeData.length"
        v-model:selected-keys="checkedKeys"
        :tree-data="treeData"
        :field-names="{
          key: 'id',
          title: 'label',
          children: 'children'
        }"
        :filter-tree-node="filterTreeNode"
        @select="handleTreeSelect"
        show-line
        default-expand-all
        block-node
      >
      </a-tree>
    </a-col>
    <a-col :span="20">
      <search
        :options="searchOptions"
        :label-span="6"
        :dropdown-length="3"
        @search-cb="searchCb"
        @reset-cb="resetCb"
      />
      <a-row class="form-item-margin">
        <a-col>
          <action-table
            :options="['add', 'delete', 'import', 'export']"
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
        row-key="userId"
        :row-selection="{
          onChange: handleChangeSelection,
          getCheckboxProps: (record) => ({
            disabled: record.userId === 1
          })
        }"
        @change="handleChange"
      >
        <template #bodyCell="{ column, index, text, record }">
          <template v-if="column.dataIndex === 'index'"
            >{{ index + 1 }}
          </template>
          <template v-if="column.dataIndex === 'status'">
            <dict-tag :value="text" :options="dictObjs['sys_notice_status']" />
          </template>
          <template v-if="column.dataIndex === 'action'">
            <action-table
              v-if="record.userId !== 1"
              btn-size="small"
              btn-type="link"
              :options="['edit', 'delete', 'resetPassword', 'assignRoles']"
              @click-cb="
                (type) => {
                  handleActionTables(type, { ...record, index: index + 1 });
                }
              "
            />
          </template>
        </template>
      </a-table>
    </a-col>
  </a-row>
  <a-modal
    v-model:open="open"
    :title="title"
    closable
    :width="600"
    @ok="modalOk"
  >
    <v-w-form
      v-if="open"
      ref="vwFormRef"
      :options="options"
      :rules="rules"
      :default-value="defaultValue"
    />
  </a-modal>
</template>
<style lang="less" scoped>
:deep(.ant-tree) {
  background: none;
}

:deep(.filter-node .ant-tree-title) {
  color: @colorPrimary !important;
}

.form-item-margin {
  margin: 24px 0;
}
</style>
