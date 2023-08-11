<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal, type TableColumnsType } from 'ant-design-vue';
import { computed, createVNode, h, inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  addData,
  delData,
  getData,
  listData,
  updateData
} from '@/apis/system/dict/data';
import { getType, optionSelect } from '@/apis/system/dict/type';
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

dictObjs.list_class_options = [
  {
    value: 'default',
    label: '默认'
  },
  {
    value: 'primary',
    label: '主要'
  },
  {
    value: 'success',
    label: '成功'
  },
  {
    value: 'info',
    label: '信息'
  },
  {
    value: 'warning',
    label: '警告'
  },
  {
    value: 'danger',
    label: '危险'
  }
];

const { dictId } = router.currentRoute.value.params;

// 搜索表单项
const searchOptions = ref<IOptSearch[]>([
  {
    label: '字典名称',
    name: 'dictType',
    inputType: 'select',
    selectType: 'dict_values'
  },
  { label: '字典标签', name: 'dictLabel' },
  {
    label: '状态',
    name: 'status',
    inputType: 'select',
    selectType: 'sys_normal_disable'
  }
]);
const searchDefaultValues = ref<unknown>({});

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
    title: '字典标签',
    dataIndex: 'dictLabel',
    key: 'dictLabel'
  },
  {
    title: '字典键值',
    dataIndex: 'dictValue',
    key: 'dictValue'
  },
  {
    title: '字典排序',
    dataIndex: 'dictSort',
    key: 'dictSort'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark'
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

// 搜索结合表格
const {
  dataSource,
  formStatus,
  rowKeys,
  paginationIndicator,
  handleChangeSelection,
  handleChange,
  getList,
  searchCb
} = useTableRequest(listData, 'rows', searchDefaultValues.value, true);

// 重置检索表单
const resetCb = (): void => {
  formStatus.value = {};
  getList();
};

const optType = ref<OptType>('add');
const defaultValue = ref<unknown>({});
// modal 数据
const vwFormRef = ref();
const titleRef = ref('新增字典值');
const open = ref<boolean>(false);

// 新增数据结构
const defaultOptions: IFormItem[] = [
  {
    label: '字典类型',
    name: 'dictType',
    disabled: true
  },
  {
    label: '数据标签',
    name: 'dictLabel'
  },
  {
    label: '数据键值',
    name: 'dictValue'
  },
  {
    label: '样式属性',
    name: 'cssClass'
  },
  {
    label: '显示排序',
    name: 'dictSort',
    inputType: 'inputNumber'
  },
  {
    label: '回显样式',
    name: 'listClass',
    inputType: 'select',
    selectType: 'list_class_options'
  },
  {
    label: '状态',
    name: 'status',
    inputType: 'radio',
    selectType: 'sys_normal_disable'
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
  dictLabel: [{ required: true, message: '数据标签不能为空' }],
  dictValue: [{ required: true, message: '数据键值不能为空' }],
  dictSort: [{ required: true, message: '显示排序不能为空' }]
});
const handleActionTables = async (
  type: OptType,
  record?: unknown = {}
): void => {
  optType.value = type;
  if (type === 'add') {
    const params = searchDefaultValues.value;
    defaultValue.value = {
      dictType: params.dictType
    };
    open.value = true;
    void vwFormRef.value?.resetFields();
  }

  if (type === 'edit') {
    titleRef.value = '修改字典值';
    getData(record.dictCode).then((res) => {
      defaultValue.value = { ...res.data, ...defaultValue.value };
      open.value = true;
      void vwFormRef.value?.resetFields();
    });
  }

  if (type === 'delete') {
    let { dictCode, index } = record;
    if (!dictCode) {
      if (rowKeys.value.length === 0) {
        void message.warning('请选中至少一条数据进行操作');
        return;
      }
      dictCode = rowKeys.value.join(',');
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
        return delData(dictCode).then(() => {
          getList();
        });
      }
    });
  }

  if (type === 'export') {
    download(
      'system/dict/data/export',
      formStatus,
      `dictData_${+new Date()}.xlsx`
    );
  }
};

/**
 * 新增/修改提交
 * */
const modalOk = (): void => {
  void vwFormRef.value?.validate().then(() => {
    let cb = addData;
    const params = vwFormRef.value.formState;
    if (optType.value === 'edit') {
      params.dictCode = defaultValue.value.dictCode;
      cb = updateData;
    }

    cb(params).then(() => {
      open.value = false;
      getList();
    });
  });
};

const close = (): void => {
  router.back();
};

onMounted(async () => {
  await getType(dictId).then((res) => {
    searchDefaultValues.value.dictType = res.data.dictType;
  });
  await optionSelect().then((res) => {
    dictObjs.dict_values = res.data.map((item) => ({
      label: item.dictName,
      value: item.dictType,
      raw: item
    }));
  });

  getList();
});
</script>

<template>
  <search
    :default-value="searchDefaultValues"
    :options="searchOptions"
    @search-cb="searchCb"
    @reset-cb="resetCb"
  />
  <a-row class="form-item-margin">
    <a-col>
      <action-table
        :options="['add', 'delete', 'export']"
        :row-gutter="16"
        :dropdown-length="4"
        @click-cb="handleActionTables"
      >
        <template #opt="opt">
          <a-col :span="1.5">
            <a-button :size="opt.btnSize" :type="opt.btnType" @click="close">
              <template #icon>
                <close-outlined />
              </template>
              <span style="margin-left: 4px">关闭</span>
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
    row-key="dictCode"
    :row-selection="{
      onChange: handleChangeSelection
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
          btn-size="small"
          btn-type="link"
          :options="['edit', 'delete']"
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
      v-if="open"
      :options="options"
      :rules="rules"
      :default-value="defaultValue"
    />
  </a-modal>
</template>
