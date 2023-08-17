<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal, type TableColumnsType } from 'ant-design-vue';
import { computed, createVNode, h, inject, nextTick, ref } from 'vue';

import {
  addDept,
  delDept,
  getDept,
  listDept,
  updateDept
} from '@/apis/system/dept';
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

// 搜索表单项
const searchOptions = ref<IOptSearch[]>([
  { label: '部门名称', name: 'deptName' },
  {
    label: '状态',
    name: 'status',
    inputType: 'select',
    selectType: 'sys_normal_disable'
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
    title: '部门名称',
    dataIndex: 'deptName',
    key: 'deptName'
  },
  {
    title: '顺序',
    dataIndex: 'orderNum',
    key: 'orderNum'
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

const { dataSource, formStatus, getList, searchCb, originalData } =
  useTableRequest(listDept, 'data', {}, false, true, { value: 'deptId' });

const expandedRowKeys: string | number[] = computed(() =>
  originalData.value.map((data) => data.deptId)
);

// 重置检索表单
const resetCb = (): void => {
  formStatus.value = {};
  getList();
};

const optType = ref<OptType>('add');
const defaultValue = ref<unknown>({});
// modal 数据
const vwFormRef = ref();
const titleRef = ref('新增部门');
const open = ref<boolean>(false);

// 新增数据结构
const defaultOptions: IFormItem[] = [
  {
    label: '上级部门',
    name: 'parentId',
    inputType: 'treeSelect',
    bisection: 1,
    fieldNames: { children: 'children', label: 'deptName', value: 'deptId' }
  },
  {
    label: '部门名称',
    name: 'deptName'
  },
  {
    label: '显示排序',
    name: 'orderNum',
    inputType: 'inputNumber'
  },
  {
    label: '负责人',
    name: 'leader'
  },
  {
    label: '联系电话',
    name: 'phone'
  },
  {
    label: '邮箱',
    name: 'email'
  },
  {
    label: '部门状态',
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
  parentId: [{ required: true, message: '上级部门不能为空' }],
  deptName: [{ required: true, message: '部门名称不能为空' }],
  orderNum: [{ required: true, message: '显示排序不能为空' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址' }],
  phone: [
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码' }
  ]
});

const handleActionTables = async (
  type: OptType,
  record?: unknown = {}
): void => {
  optType.value = type;

  if (type === 'add') {
    titleRef.value = '新增部门';
    options.value = defaultOptions;
    const { deptId, deptName } = record;
    open.value = true;
    if (deptName) {
      defaultValue.value = {};
      defaultValue.value.parentId = deptId;
    } else {
      defaultValue.value = {};
    }
    void vwFormRef.value?.resetFields();
  }
  if (type === 'edit') {
    const { parentId } = record;
    if (parentId === 0) {
      options.value = defaultOptions.filter(
        (option) => option.name !== 'parentId'
      );
    } else {
      options.value = defaultOptions;
    }

    titleRef.value = '修改部门';
    getDept(record.deptId).then((res) => {
      defaultValue.value = { ...res.data };
      open.value = true;
      void vwFormRef.value?.resetFields();
    });
  }

  if (type === 'add' || type === 'edit') {
    options.value.forEach((option) => {
      if (option.name === 'parentId') {
        option.treeOptions = dataSource.value;
      }
    });
  }

  if (type === 'delete') {
    const { deptId, index } = record;
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
        return delDept(deptId).then(() => {
          getList();
        });
      }
    });
  }
};

/**
 * 新增/修改提交
 * */
const modalOk = (): void => {
  void vwFormRef.value?.validate().then(() => {
    let cb = addDept;
    const params = vwFormRef.value.formState;
    if (optType.value === 'edit') {
      params.deptId = defaultValue.value.deptId;
      params.parentId = defaultValue.value.parentId;
      cb = updateDept;
    }

    cb(params).then(() => {
      open.value = false;
      getList();
    });
  });
};

// 展开折叠
const expendCollapseVal = ref<[]>([]);
const expandCollapse = (): void => {
  if (expendCollapseVal.value.length === 0) {
    expendCollapseVal.value = expandedRowKeys.value;
  } else {
    expendCollapseVal.value = [];
  }
};

const handleActions = (record): string[] => {
  if (record.parentId === 0) {
    return ['edit', 'add'];
  }
  return ['edit', 'add', 'delete'];
};
</script>

<template>
  <search :options="searchOptions" @search-cb="searchCb" @reset-cb="resetCb" />
  <a-row class="form-item-margin">
    <a-col>
      <action-table
        :options="['add']"
        :row-gutter="16"
        @click-cb="handleActionTables"
      >
        <template #opt="slot">
          <a-col :span="1.5">
            <a-button
              :size="slot.size"
              :type="slot.type"
              @click="expandCollapse"
            >
              <template #icon>
                <node-collapse-outlined v-if="expendCollapseVal.length === 0" />
                <node-expand-outlined v-else />
              </template>
              <span style="margin-left: 4px">展开/折叠</span>
            </a-button>
          </a-col>
        </template>
      </action-table>
    </a-col>
  </a-row>
  <a-table
    :columns="columnsGetters"
    :data-source="dataSource"
    v-model:expanded-row-keys="expendCollapseVal"
    row-key="deptId"
    :pagination="false"
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
          :options="handleActions(record)"
          :dropdown-length="3"
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
