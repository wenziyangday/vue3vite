<script setup lang="ts">
import { type TableColumnsType } from 'ant-design-vue';
import { computed, inject, onBeforeMount, ref } from 'vue';

import { deptTreeSelect, listUser } from '@/apis/system/user';
import ActionTable from '@/components/action-table/ActionTable.vue';
import DictTag from '@/components/dict-tag/DictTag.vue';
import Search from '@/components/search/Search.vue';
import keyProvide from '@/constants/keyProvide';
import useTableRequest from '@/plugins/hooks/useTableRequest';
import { type IOptSearch } from '@/types/opts';

/**
 * 全局获取字典值
 * */
const dictInject = inject(keyProvide.$getDict);
dictInject(['sys_notice_status']);
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
    selectType: 'sys_notice_status'
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
  });
};

onBeforeMount(() => {
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
        @reset-cb="getList"
      />
      <a-row class="form-item-margin">
        <a-col>
          <action-table
            :options="['add', 'delete', 'import', 'export']"
            :row-gutter="16"
            :dropdown-length="4"
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
                  handleActionsTable(type, { ...record, index: index + 1 });
                }
              "
            />
          </template>
        </template>
      </a-table>
    </a-col>
  </a-row>
</template>
<style lang="less" scoped>
:deep(.ant-tree) {
  background: none;
}

:deep {
  .filter-node {
    .ant-tree-title {
      color: @colorPrimary !important;
    }
  }
}

.form-item-margin {
  margin: 24px 0;
}
</style>
