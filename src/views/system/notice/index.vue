<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Form, message, Modal, type TableColumnsType } from 'ant-design-vue';
import { computed, createVNode, h, inject, reactive, ref } from 'vue';

import {
  addNotice,
  delNotice,
  listNotice,
  updateNotice
} from '@/apis/system/notice';
import ActionTable from '@/components/action-table/ActionTable.vue';
import ConfirmContent from '@/components/confirm-content/ConfirmContent.vue';
import DictTag from '@/components/dict-tag/DictTag.vue';
import Search from '@/components/search/Search.vue';
import keyProvide from '@/constants/keyProvide';
import useTableRequest from '@/plugins/hooks/useTableRequest';
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

const {
  dataSource,
  paginationIndicator,
  rowKeys,
  handleChangeSelection,
  handleChange,
  getList,
  searchCb
} = useTableRequest(listNotice);

/**
 * modal state
 * */
interface IContentState {
  noticeTitle: string;
  noticeType: string;
  status: string;
  noticeContent: string;
  noticeId?: number | string;
}

const contentState = ref<IContentState>({
  noticeTitle: null,
  noticeType: null,
  status: '0',
  noticeContent: null,
  noticeId: null
});
const open = ref<boolean>(false);
const titleRef = ref<string>('添加公告');
const optType = ref<string>('add');
const rules = reactive({
  noticeTitle: [{ required: true, message: '公告标题不能为空' }],
  noticeType: [{ required: true, message: '公告类型不能为空' }]
});

const { useForm } = Form;
const { validate, validateInfos, resetFields } = useForm(contentState, rules);
/**
 * 新增/修改提交
 * */
const handlePostNotice = (): void => {
  void validate().then(() => {
    let cb = addNotice;
    if (optType.value === 'edit') {
      cb = updateNotice;
    }
    cb(contentState.value).then(() => {
      open.value = false;
      getList();
    });
  });
};

/**
 * 表格操作统一处理
 * */
const handleActionsTable = (type: string, record?: unknown): void => {
  let { noticeTitle, noticeType, status, noticeContent, noticeId, index } =
    record ?? {};
  optType.value = type;
  if (type === 'add') {
    open.value = true;
    resetFields();
  } else if (type === 'edit') {
    // 对于contentState是reactive，需使用下面更新对象的操作方式，从而保留响应式
    // contentState.noticeTitle = noticeTitle;
    // contentState.noticeType = noticeType;
    // contentState.status = status;
    // contentState.noticeContent = noticeContent;
    // contentState.noticeId = noticeId;
    contentState.value = {
      noticeTitle,
      noticeType,
      status,
      noticeContent,
      noticeId
    };
    open.value = true;
  } else if (type === 'delete') {
    if (!noticeId) {
      if (rowKeys.value.length === 0) {
        void message.warning('请选中至少一条数据进行操作');
        return;
      }
      noticeId = rowKeys.value.join(',');
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
        delNotice(noticeId).then(() => {
          void message.success('删除成功');
          getList();
        });
      }
    });
  }
};
</script>

<template>
  <search :options="searchOptions" @search-cb="searchCb" @reset-cb="getList" />
  <a-row class="bottom-row" justify="space-between">
    <a-col>
      <action-table
        :options="['add', 'delete']"
        :row-gutter="16"
        :dropdown-length="4"
        @click-cb="handleActionsTable"
      />
    </a-col>
  </a-row>

  <a-table
    :columns="columnsGetters"
    :data-source="dataSource"
    :pagination="paginationIndicator"
    row-key="noticeId"
    :row-selection="{
      onChange: handleChangeSelection
    }"
    @change="handleChange"
  >
    <template #bodyCell="{ column, index, text, record }">
      <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
      <template v-if="column.dataIndex === 'noticeType'">
        <dict-tag :value="text" :options="dictObjs['sys_notice_type']" />
      </template>
      <template v-if="column.dataIndex === 'status'">
        <dict-tag :value="text" :options="dictObjs['sys_notice_status']" />
      </template>
      <template v-if="column.dataIndex === 'action'">
        <action-table
          btn-size="small"
          btn-type="link"
          :options="['edit', 'delete']"
          @click-cb="
            (type) => {
              handleActionsTable(type, { ...record, index: index + 1 });
            }
          "
        />
      </template>
    </template>
  </a-table>

  <a-modal
    v-model:open="open"
    :title="titleRef"
    :width="600"
    @ok="handlePostNotice"
  >
    <a-form :model="contentState" :rules="rules">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="公告标题" v-bind="validateInfos.noticeTitle">
            <a-input
              v-model:value="contentState.noticeTitle"
              allow-clear
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="公告类型" v-bind="validateInfos.noticeType">
            <a-select
              v-model:value="contentState.noticeType"
              :options="dictObjs['sys_notice_type']"
              style="width: 100%"
              allow-clear
            ></a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="状态" name="status">
        <a-radio-group
          v-model:value="contentState.status"
          :options="dictObjs['sys_notice_status']"
        ></a-radio-group>
      </a-form-item>
      <a-form-item label="内容" name="noticeContent">
        <a-textarea v-model:value="contentState.noticeContent" allow-clear />
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
