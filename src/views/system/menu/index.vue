<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal, type TableColumnsType } from 'ant-design-vue';
import { computed, createVNode, h, inject, ref } from 'vue';

import {
  addMenu,
  delMenu,
  getMenu,
  listMenu,
  updateMenu
} from '@/apis/system/menu';
import ActionTable from '@/components/action-table/ActionTable.vue';
import ConfirmContent from '@/components/confirm-content/ConfirmContent.vue';
import DictTag from '@/components/dict-tag/DictTag.vue';
import VWIconFont from '@/components/icon-font/VWIconFont.vue';
import VWForm from '@/components/table/form/VWForm.vue';
import Search from '@/components/table/search/Search.vue';
import keyProvide from '@/constants/keyProvide';
import useTableRequest from '@/plugins/hooks/useTableRequest';
import { type IFormItem, type IOptSearch, type OptType } from '@/types/opts';

/**
 * 全局方法使用
 * */
const dictInject = inject(keyProvide.$getDict);
dictInject(['sys_show_hide', 'sys_normal_disable']);
const dictObjs = inject(keyProvide.dictObjs);

// 搜索表单项
const searchOptions = ref<IOptSearch[]>([
  { label: '菜单名称', name: 'menuName' },
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
    title: '菜单名称',
    dataIndex: 'menuName',
    key: 'menuName'
  },
  {
    title: '图标',
    dataIndex: 'icon',
    key: 'icon'
  },
  {
    title: '顺序',
    dataIndex: 'orderNum',
    key: 'orderNum'
  },
  {
    title: '权限标识',
    dataIndex: 'perms',
    key: 'perms'
  },
  {
    title: '组件路径',
    dataIndex: 'component',
    key: 'component'
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
  useTableRequest(listMenu, 'data', {}, false, true, { value: 'menuId' });

const expandedRowKeys: string | number[] = computed(() =>
  originalData.value.map((data) => data.menuId)
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
const titleRef = ref('新增菜单');
const open = ref<boolean>(false);
// 新增数据结构
const defaultOptions: IFormItem[] = [
  {
    label: '上级菜单',
    name: 'parentId',
    inputType: 'treeSelect',
    bisection: 1,
    fieldNames: { children: 'children', label: 'menuName', value: 'menuId' }
  },
  {
    label: '菜单类型',
    name: 'menuType',
    inputType: 'radio',
    defaultValue: 'M',
    treeOptions: [
      {
        label: '目录',
        value: 'M'
      },
      {
        label: '菜单',
        value: 'C'
      },
      {
        label: '按钮',
        value: 'F'
      }
    ],
    bisection: 1
  },
  {
    label: '菜单图标',
    name: 'icon',
    relationShow: [
      ['menuType', 'M'],
      ['menuType', 'C']
    ]
  },
  {
    label: '菜单名称',
    name: 'menuName'
  },
  {
    label: '显示排序',
    name: 'orderNum',
    inputType: 'inputNumber'
  },
  {
    label: '是否外链',
    name: 'isFrame',
    inputType: 'radio',
    treeOptions: [
      {
        label: '是',
        value: '0'
      },
      {
        label: '否',
        value: '1'
      }
    ],
    relationShow: [
      ['menuType', 'M'],
      ['menuType', 'C']
    ],
    tooltipDesc: '选择是外链则路由地址需要以`http(s)://`开头'
  },

  {
    label: '路由地址',
    name: 'path',
    relationShow: [
      ['menuType', 'M'],
      ['menuType', 'C']
    ],
    tooltipDesc:
      '访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头'
  },
  {
    label: '组件路径',
    name: 'component',
    relationShow: ['menuType', 'C'],
    tooltipDesc: '访问的组件路径，如：`system/user/index`，默认在`views`目录下'
  },
  {
    label: '权限字符',
    name: 'perms',
    relationShow: [
      ['menuType', 'C'],
      ['menuType', 'F']
    ],
    tooltipDesc:
      "控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
  },
  {
    label: '路由参数',
    name: 'query',
    relationShow: ['menuType', 'C'],
    tooltipDesc: '访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`'
  },
  {
    label: '是否缓存',
    name: 'isCache',
    inputType: 'radio',
    treeOptions: [
      {
        label: '缓存',
        value: '0'
      },
      {
        label: '不缓存',
        value: '1'
      }
    ],
    relationShow: ['menuType', 'C'],
    tooltipDesc:
      '选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致'
  },
  {
    label: '显示状态',
    name: 'visible',
    inputType: 'radio',
    selectType: 'sys_show_hide',
    relationShow: [
      ['menuType', 'M'],
      ['menuType', 'C']
    ],
    tooltipDesc: '选择隐藏则路由将不会出现在侧边栏，但仍然可以访问'
  },
  {
    label: '菜单状态',
    name: 'status',
    inputType: 'radio',
    selectType: 'sys_normal_disable',
    relationShow: [
      ['menuType', 'M'],
      ['menuType', 'C']
    ],
    tooltipDesc: '选择停用则路由将不会出现在侧边栏，也不能被访问'
  }
];
const options = ref<IFormItem[]>(defaultOptions);
const rules = ref({
  parentId: [{ required: true, message: '上级部门不能为空' }],
  menuName: [{ required: true, message: '部门名称不能为空' }],
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
    const { menuId, menuName } = record;
    open.value = true;
    if (menuName) {
      defaultValue.value.parentId = menuId;
    } else {
      defaultValue.value = {};
      defaultValue.value.parentId = 0;
    }
    options.value.forEach((option) => {
      if (option.name === 'parentId') {
        const menu = {
          menuId: 0,
          menuName: '顶层类目',
          children: dataSource.value
        };
        option.treeOptions = [menu];
      }
    });
    void vwFormRef.value?.resetFields();
  }

  if (type === 'edit') {
    titleRef.value = '修改菜单';
    getMenu(record.menuId).then((res) => {
      defaultValue.value = { ...res.data, ...defaultValue.value };
      open.value = true;
      void vwFormRef.value?.resetFields();
    });
  }

  if (type === 'delete') {
    const { menuId, index } = record;
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
        return delMenu(menuId).then(() => {
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
    let cb = addMenu;
    const params = vwFormRef.value.formState;
    if (optType.value === 'edit') {
      params.menuId = defaultValue.value.menuId;
      cb = updateMenu;
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
    row-key="menuId"
    :pagination="false"
  >
    <template #bodyCell="{ column, index, text, record }">
      <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
      <template v-if="column.dataIndex === 'icon'">
        <v-w-icon-font :type="record.icon" />
      </template>
      <template v-if="column.dataIndex === 'status'">
        <dict-tag :value="text" :options="dictObjs['sys_normal_disable']" />
      </template>
      <template v-if="column.dataIndex === 'action'">
        <action-table
          btn-size="small"
          btn-type="link"
          :options="['edit', 'add', 'delete']"
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
  <a-modal v-model:open="open" :title="titleRef" :width="700" @ok="modalOk">
    <v-w-form
      ref="vwFormRef"
      v-if="open"
      :options="options"
      :rules="rules"
      :default-value="defaultValue"
    />
  </a-modal>
</template>
