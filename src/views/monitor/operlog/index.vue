<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal, type TableColumnsType } from 'ant-design-vue';
import { computed, createVNode, h, inject, ref } from 'vue';

import { cleanOperlog, delOperlog, listLog } from '@/apis/monitor/operlog';
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
dictInject(['sys_oper_type', 'sys_common_status']);
const dictObjs = inject(keyProvide.dictObjs);
const download = inject(keyProvide.$download);
// 搜索表单项
const searchOptions = ref<IOptSearch[]>([
  { label: '系统模块', name: 'title' },
  { label: '操作人员', name: 'operName' },
  {
    label: '类型',
    name: 'businessType',
    inputType: 'select',
    selectType: 'sys_oper_type'
  },
  {
    label: '操作状态',
    name: 'status',
    inputType: 'select',
    selectType: 'sys_common_status'
  },
  { label: '操作时间', name: 'operTime', inputType: 'dateRangePicker' }
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
    title: '系统模块',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '操作类型',
    dataIndex: 'businessType',
    key: 'businessType'
  },
  {
    title: '操作人员',
    dataIndex: 'operName',
    key: 'operName'
  },
  {
    title: '操作地址',
    dataIndex: 'operIp',
    key: 'operIp'
  },
  {
    title: '操作地点',
    dataIndex: 'operLocation',
    key: 'operLocation'
  },
  {
    title: '操作状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '操作日期',
    dataIndex: 'operTime',
    key: 'operTime'
  },
  {
    title: '消耗时间',
    dataIndex: 'costTime',
    key: 'costTime'
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
} = useTableRequest(listLog);

// 重置检索表单
const resetCb = (): void => {
  formStatus.value = {};
  getList();
};

const optType = ref<OptType>('add');
const defaultValue = ref<unknown>({});
// modal 数据
const vwFormRef = ref();
const titleRef = ref('新增操作日志');
const open = ref<boolean>(false);

// 新增数据结构
const defaultOptions: IFormItem[] = [
  {
    label: '操作模块',
    name: 'title'
  },
  {
    label: '操作类型',
    name: 'businessType',
    inputType: 'select',
    selectType: 'sys_oper_type'
  },
  {
    label: '操作人员',
    name: 'operName'
  },
  {
    label: '操作地址',
    name: 'operIp'
  },
  {
    label: '操作地点',
    name: 'operLocation'
  },
  {
    label: '请求地址',
    name: 'operUrl'
  },
  {
    label: '请求方式',
    name: 'requestMethod'
  },
  {
    label: '操作状态',
    name: 'status',
    inputType: 'radio',
    selectType: 'sys_common_status'
  },
  {
    label: '消耗时间',
    name: 'costTime'
  },
  {
    label: '操作时间',
    name: 'operTime'
  },
  {
    label: '操作方法',
    name: 'method',
    inputType: 'textarea',
    bisection: 1
  },
  {
    label: '请求参数',
    name: 'operParam',
    inputType: 'textarea',
    bisection: 1
  },
  {
    label: '返回参数',
    name: 'jsonResult',
    inputType: 'textarea',
    bisection: 1
  },
  {
    label: '异常信息',
    name: 'errorMsg',
    inputType: 'textarea',
    relationShow: ['status', '1'],
    bisection: 1
  }
];
const options = ref<IFormItem[]>(defaultOptions);
const handleActionTables = async (
  type: OptType,
  record?: unknown = {}
): void => {
  optType.value = type;
  if (type === 'detail') {
    titleRef.value = '查看详情';
    defaultValue.value = {
      ...record,
      businessType: record.businessType?.toString(),
      status: record.status?.toString()
    };
    open.value = true;
    void vwFormRef.value?.resetFields();
  }
  if (type === 'delete') {
    let { operId, index } = record;
    if (!operId) {
      if (rowKeys.value.length === 0) {
        void message.warning('请选中至少一条数据进行操作');
        return;
      }
      operId = rowKeys.value.join(',');
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
        return delOperlog(operId).then(() => {
          getList();
        });
      }
    });
  }
  if (type === 'export') {
    download(
      'monitor/operlog/export',
      formStatus,
      `operateLog_${+new Date()}.xlsx`
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
      return cleanOperlog().then(() => {
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
    row-key="operId"
    :row-selection="{
      onChange: handleChangeSelection
    }"
    @change="handleChange"
  >
    <template #bodyCell="{ column, index, text, record }">
      <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
      <template v-if="column.dataIndex === 'costTime'">{{ text }}毫秒</template>
      <template v-if="column.dataIndex === 'businessType'">
        <dict-tag :value="text" :options="dictObjs['sys_oper_type']" />
      </template>
      <template v-if="column.dataIndex === 'status'">
        <dict-tag
          :value="text.toString()"
          :options="dictObjs['sys_common_status']"
        />
      </template>
      <template v-if="column.dataIndex === 'action'">
        <action-table
          btn-size="small"
          btn-type="link"
          :options="['detail']"
          @click-cb="
            (type) => {
              handleActionTables(type, { ...record, index: index + 1 });
            }
          "
        />
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="open" :title="titleRef" :width="600" :footer="null">
    <v-w-form
      ref="vwFormRef"
      v-if="open"
      :options="options"
      :disabled="true"
      :default-value="defaultValue"
    />
  </a-modal>
</template>
