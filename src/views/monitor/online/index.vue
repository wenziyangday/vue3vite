<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal, type TableColumnsType } from 'ant-design-vue';
import { computed, createVNode, h, ref } from 'vue';

import { forceLogout, listOnline } from '@/apis/monitor/online';
import ActionTable from '@/components/action-table/ActionTable.vue';
import ConfirmContent from '@/components/confirm-content/ConfirmContent.vue';
import Search from '@/components/table/search/Search.vue';
import useTableRequest from '@/plugins/hooks/useTableRequest';
import { type IOptSearch } from '@/types/opts';
import { parseTime } from '@/utils/tools';

// 搜索表单项
const searchOptions = ref<IOptSearch[]>([
  { label: '主机', name: 'ipaddr' },
  { label: '登录名称', name: 'userName' }
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
    title: '会话编号',
    dataIndex: 'tokenId',
    key: 'tokenId'
  },
  {
    title: '登录名称',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '部门名称',
    dataIndex: 'deptName',
    key: 'deptName'
  },
  {
    title: '主机',
    dataIndex: 'ipaddr',
    key: 'ipaddr'
  },
  {
    title: '登录地点',
    dataIndex: 'loginLocation',
    key: 'loginLocation'
  },
  {
    title: '浏览器',
    dataIndex: 'browser',
    key: 'browser'
  },
  {
    title: '操作系统',
    dataIndex: 'os',
    key: 'os'
  },
  {
    title: '登录时间',
    dataIndex: 'loginTime',
    key: 'loginTime'
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
} = useTableRequest(listOnline);

// 重置检索表单
const resetCb = (): void => {
  formStatus.value = {};
  getList();
};

/**
 * 强退用户
 * */
const handleForce = (record): void => {
  const { tokenId, userName } = record;
  Modal.confirm({
    title: '系统提示',
    closable: true,
    icon: () => {},
    content: h('div', [
      createVNode(ExclamationCircleOutlined),
      createVNode(ConfirmContent, {
        word: `是否确认强退名称为${userName}的用户？`
      })
    ]),
    okText: '确认',
    onOk: () => {
      return forceLogout(tokenId).then(() => {
        void message.success('强退用户成功');
        getList();
      });
    }
  });
};
</script>

<template>
  <search :options="searchOptions" @search-cb="searchCb" @reset-cb="resetCb" />
  <a-table
    class="form-item-margin"
    :columns="columnsGetters"
    :data-source="dataSource"
    :pagination="paginationIndicator"
    row-key="infoId"
    @change="handleChange"
  >
    <template #bodyCell="{ column, index, text, record }">
      <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
      <template v-if="column.dataIndex === 'loginTime'">{{
        parseTime(text, 'YYYY-MM-DD HH:mm:ss')
      }}</template>
      <template v-if="column.dataIndex === 'action'">
        <action-table btn-size="small" btn-type="link" :options="['']">
          <template #opt="slot">
            <a-button
              :size="slot.size"
              :type="slot.type"
              @click="handleForce(record)"
            >
              <template #icon>
                <delete-outlined />
              </template>
              <span style="margin-left: 4px">强退</span>
            </a-button>
          </template>
        </action-table>
      </template>
    </template>
  </a-table>
</template>
