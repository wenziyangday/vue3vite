<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal, type TableColumnsType } from 'ant-design-vue';
import { computed, createVNode, h, inject, ref } from 'vue';

import {
  cleanLoginInfo,
  delLoginInfo,
  listLoginInfo,
  unlockLoginInfo
} from '@/apis/monitor/logininfof';
import ActionTable from '@/components/action-table/ActionTable.vue';
import ConfirmContent from '@/components/confirm-content/ConfirmContent.vue';
import DictTag from '@/components/dict-tag/DictTag.vue';
import Search from '@/components/table/search/Search.vue';
import keyProvide from '@/constants/keyProvide';
import useTableRequest from '@/plugins/hooks/useTableRequest';
import { type IOptSearch, type OptType } from '@/types/opts';

/**
 * 全局方法使用
 * */
const dictInject = inject(keyProvide.$getDict);
dictInject(['sys_common_status']);
const dictObjs = inject(keyProvide.dictObjs);
const download = inject(keyProvide.$download);

// 搜索表单项
const searchOptions = ref<IOptSearch[]>([
  { label: '登录地址', name: 'ipaddr' },
  { label: '用户名称', name: 'userName' },
  {
    label: '状态',
    name: 'status',
    inputType: 'select',
    selectType: 'sys_common_status'
  },
  { label: '登录时间', name: 'loginTime', inputType: 'dateRangePicker' }
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
    title: '用户名称',
    dataIndex: 'userName',
    key: 'userName',
    sorter: (a, b) => a.userName - b.userName
  },
  {
    title: '登录地址',
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
    title: '登录状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '操作信息',
    dataIndex: 'msg',
    key: 'msg'
  },
  {
    title: '登录日期',
    dataIndex: 'loginTime',
    key: 'loginTime',
    sorter: (a, b) => a.loginTime - b.loginTime
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
} = useTableRequest(listLoginInfo);

// 重置检索表单
const resetCb = (): void => {
  formStatus.value = {};
  getList();
};

const handleActionTables = async (
  type: OptType,
  record?: unknown = {}
): void => {
  if (type === 'delete') {
    let { infoId, index } = record;
    if (!infoId) {
      if (rowKeys.value.length === 0) {
        void message.warning('请选中至少一条数据进行操作');
        return;
      }
      infoId = rowKeys.value.join(',');
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
        return delLoginInfo(infoId).then(() => {
          getList();
        });
      }
    });
  }
  if (type === 'export') {
    download(
      'monitor/logininfor/export',
      formStatus,
      `loginInfo_${+new Date()}.xlsx`
    );
  }
};

/**
 * 清空日志
 * */
const handleClean = (): void => {
  Modal.confirm({
    title: '系统提示',
    closable: true,
    icon: () => {},
    content: h('div', [
      createVNode(ExclamationCircleOutlined),
      createVNode(ConfirmContent, {
        word: '确定清空日志内容？'
      })
    ]),
    okText: '确认',
    onOk: () => {
      return cleanLoginInfo().then(() => {
        getList();
      });
    }
  });
};

const handleLock = (): void => {
  if (rowKeys.value.length === 0 || rowKeys.value.length > 1) {
    void message.warning('请选中一条数据进行操作');
    return;
  }
  const [infoId] = rowKeys.value;
  const [{ userName }] = dataSource.value.filter((ds) => ds.infoId === infoId);
  Modal.confirm({
    title: '系统提示',
    closable: true,
    icon: () => {},
    content: h('div', [
      createVNode(ExclamationCircleOutlined),
      createVNode(ConfirmContent, {
        word: `确定解锁${userName}数据项？`
      })
    ]),
    okText: '确认',
    onOk: () => {
      return unlockLoginInfo(userName).then(() => {
        void message.success('解锁成功');
        getList();
      });
    }
  });
};
</script>

<template>
  <search :options="searchOptions" @search-cb="searchCb" @reset-cb="resetCb" />
  <a-row class="form-item-margin">
    <a-col>
      <action-table
        :options="['delete', 'export']"
        :row-gutter="16"
        :dropdown-length="4"
        @click-cb="handleActionTables"
      >
        <template #opt="slot">
          <a-col :span="1.5">
            <a-button :size="slot.size" :type="slot.type" @click="handleLock">
              <template #icon>
                <lock-outlined />
              </template>
              <span style="margin-left: 4px">解锁</span>
            </a-button>
          </a-col>
          <a-col :span="1.5">
            <a-button :size="slot.size" :type="slot.type" @click="handleClean">
              <template #icon>
                <clear-outlined />
              </template>
              <span style="margin-left: 4px">清空</span>
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
    row-key="infoId"
    :row-selection="{
      onChange: handleChangeSelection
    }"
    @change="handleChange"
  >
    <template #bodyCell="{ column, index, text }">
      <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
      <template v-if="column.dataIndex === 'status'">
        <dict-tag
          :value="text.toString()"
          :options="dictObjs['sys_common_status']"
        />
      </template>
    </template>
  </a-table>
</template>
