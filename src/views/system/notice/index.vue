<script setup lang="ts">
import { Form, type TableColumnsType } from 'ant-design-vue';
import { computed, inject, onMounted, reactive, ref } from 'vue';

import { listNotice } from '@/apis/system/notice';
import ActionTable from '@/components/action-table/ActionTable.vue';
import DictTag from '@/components/dict-tag/DictTag.vue';
import Search from '@/components/search/Search.vue';
import keyProvide from '@/constants/keyProvide';
import { type IOptSearch } from '@/types/opts';

/**
 * 全局获取字典值
 * */
const dictInject = inject(keyProvide.$getDict);
dictInject(['sys_notice_type', 'sys_notice_status']);
const dictObjs = inject(keyProvide.dictObjs);

/**
 * 检索 配置
 * */
const searchOptions = ref<IOptSearch[]>([
  { label: '公告标题', name: 'noticeTitle' },
  { label: '操作人员', name: 'createBy' },
  {
    label: '类型',
    name: 'noticeType',
    inputType: 'select',
    selectType: 'sys_notice_type'
  }
]);

/**
 * 新增内容
 * */
interface IContentState {
  noticeTitle: string;
  noticeType: string;
  status: string;
  noticeContent: string;
}

const contentState = reactive<IContentState>({});

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
    key: 'noticeTitle'
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
  defaultPageSize: 10,
  total: 0
});

/**
 * modal state
 * */
const open = ref<boolean>(false);
const titleRef = ref<string>('添加公告');
const rules = ref({
  noticeTitle: [
    { required: true, message: '公告标题不能为空', trigger: 'blur' }
  ],
  noticeType: [
    { required: true, message: '公告类型不能为空', trigger: 'change' }
  ]
});

/**
 * 获取公告列表
 * */
const getList = (formState?: unknown): void => {
  const {
    value: { current: pageNum, defaultPageSize: pageSize }
  } = paginationIndicator;
  listNotice({
    pageNum,
    pageSize,
    ...formState
  }).then((res) => {
    dataSource.value = res.rows;
    paginationIndicator.value.total = res.total;
  });
};

/**
 * 分页控制器
 * */
const handleChange = (pagination): void => {
  paginationIndicator.value = pagination;
  getList();
};

/**
 * 搜索回调
 * */
const searchCb = (formStatus: unknown): void => {
  getList(formStatus);
};

/**
 * 重置回调
 * */

onMounted(() => {
  getList();
});
</script>

<template>
  <search :options="searchOptions" @search-cb="searchCb" @reset-cb="getList" />
  <a-row class="bottom-row" justify="space-between">
    <a-col>
      <action-table :options="['edit']" :row-gutter="16" :dropdown-length="4">
        <template #opt>
          <a-col :span="1.5">
            <a-button> klkkl</a-button>
          </a-col>
        </template>
      </action-table>
    </a-col>
  </a-row>
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
      <template v-if="column.dataIndex === 'action'">
        <action-table btn-size="small" btn-type="link" />
      </template>
    </template>
  </a-table>

  <a-modal v-model:open="open" :title="titleRef" :width="600">
    <a-form :model="contentState" :rules="rules">
      <a-row :gutter="40">
        <a-col>
          <a-form-item label="公告标题" name="noticeTitle">
            <a-input v-model:value="contentState.noticeTitle" allowClear />
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item label="公告类型" name="noticeType">
            <a-select
              v-model:value="contentState.noticeType"
              :options="dictObjs['sys_notice_type']"
              style="width: 160px"
              allowClear
            ></a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="状态" name="status">
        <a-switch v-model:checked="contentState.status" :disabled="disabled" />
      </a-form-item>
      <a-form-item label="内容" name="noticeContent">
        <a-textarea v-model:value="contentState.noticeTitle" allowClear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="less" scoped>
.form-margin,
.bottom-row {
  margin-bottom: 20px;
}
</style>
