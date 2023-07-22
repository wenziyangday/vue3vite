<script setup lang="ts">
import { type TableColumnsType } from 'ant-design-vue';
import { computed, inject, onMounted, ref } from 'vue';

import { listNotice } from '@/apis/system/notice';
import DictTag from '@/components/dict-tag/DictTag.vue';
import keyProvide from '@/constants/keyProvide';

/**
 * 全局获取字典值
 * */
const dictInject = inject(keyProvide.$getDict);
dictInject(['sys_notice_type', 'sys_notice_status']);
const dictObjs = inject(keyProvide.dictObjs);

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
    title: '公告标题',
    dataIndex: 'noticeTitle',
    key: 'noticeTitle',
    align: 'center'
  },
  {
    title: '公告类型',
    dataIndex: 'noticeType',
    key: 'noticeType'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '创建者',
    dataIndex: 'createBy',
    key: 'createBy'
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

/**
 * DataSource
 * */
const dataSource: [] = ref([]);
const paginationIndicator = ref({
  current: 1,
  defaultPageSize: 1,
  total: 0
});

/**
 * 获取公告列表
 * */
const getList = (): void => {
  const {
    value: { current: pageNum, defaultPageSize: pageSize }
  } = paginationIndicator;
  listNotice({
    pageNum,
    pageSize
  }).then((res) => {
    dataSource.value = res.rows;
    paginationIndicator.value.total = res.total;
  });
};

const handleChange = (pagination): void => {
  paginationIndicator.value = pagination;
  getList();
};

onMounted(() => {
  getList();
});
</script>

<template>
  <a-table
    :columns="columnsGetters"
    :data-source="dataSource"
    :pagination="paginationIndicator"
    @change="handleChange"
  >
    <template #bodyCell="{ column, index, text }">
      <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
      <template v-if="column.dataIndex === 'noticeType'">
        <dict-tag :value="text" :options="dictObjs['sys_notice_type']" />
      </template>
      <template v-if="column.dataIndex === 'status'">
        <dict-tag :value="text" :options="dictObjs['sys_notice_status']" />
      </template>
    </template>
  </a-table>
</template>
