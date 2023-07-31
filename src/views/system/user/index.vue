<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {
  message,
  Modal,
  type TableColumnsType,
  type UploadChangeParam
} from 'ant-design-vue';
import {
  computed,
  createVNode,
  h,
  inject,
  onMounted,
  reactive,
  ref
} from 'vue';
import { useRouter } from 'vue-router';

import {
  addUser,
  delUser,
  deptTreeSelect,
  getUser,
  listUser,
  resetUserPwd,
  updateUser
} from '@/apis/system/user';
import ActionTable from '@/components/action-table/ActionTable.vue';
import ConfirmContent from '@/components/confirm-content/ConfirmContent.vue';
import DictTag from '@/components/dict-tag/DictTag.vue';
import VWForm from '@/components/table/form/VWForm.vue';
import Search from '@/components/table/search/Search.vue';
import keyProvide from '@/constants/keyProvide';
import useImport from '@/plugins/hooks/useImport';
import useTableRequest from '@/plugins/hooks/useTableRequest';
import { type IFormItem, type IOptSearch, type OptType } from '@/types/opts';

/**
 * 全局方法使用
 * */
const dictInject = inject(keyProvide.$getDict);
dictInject(['sys_normal_disable']);
const dictObjs = inject(keyProvide.dictObjs);
const download = inject(keyProvide.$download);

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
    selectType: 'sys_normal_disable'
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

const checkedKeys = ref<any[]>([]);

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
    const [gotIt] = options.value.filter((option) => option.name === 'deptId');
    gotIt.treeOptions = res.data;
  });
};

// 重置检索表单
const resetCb = (): void => {
  filterTreeInput.value = null;
  formStatus.value = {};
  checkedKeys.value = [];
  getList();
};

// modal 新增
const open = ref<boolean>(false);
const title = ref<string>('添加用户');
const userInfo = ref<{
  posts: [];
  roles: [];
}>({});
const vwFormRef = ref();
const optType = ref<string>('add');
const defaultValue = ref<Record<string, unknown>>({});
const defaultOptions: [] = [
  {
    label: '用户昵称',
    name: 'nickName'
  },
  {
    label: '归属部门',
    name: 'deptId',
    inputType: 'treeSelect',
    treeOptions: [],
    fieldNames: {
      value: 'id',
      label: 'label',
      children: 'children'
    }
  },
  {
    label: '手机号码',
    name: 'phonenumber'
  },
  {
    label: '邮箱',
    name: 'email'
  },
  {
    label: '用户名称',
    name: 'userName'
  },
  {
    label: '用户密码',
    name: 'password',
    inputType: 'inputPassword'
  },
  {
    label: '用户性别',
    name: 'sex',
    inputType: 'select',
    selectType: 'sys_user_sex'
  },
  {
    label: '状态',
    name: 'status',
    inputType: 'radio',
    selectType: 'sys_normal_disable'
  },
  {
    label: '岗位',
    name: 'postIds',
    inputType: 'select',
    treeOptions: [],
    selectMode: 'multiple',
    fieldNames: {
      value: 'postId',
      label: 'postName',
      children: 'children'
    }
  },
  {
    label: '角色',
    name: 'roleIds',
    inputType: 'select',
    treeOptions: [],
    selectMode: 'multiple',
    fieldNames: {
      value: 'roleId',
      label: 'roleName',
      children: 'children'
    }
  },
  {
    label: '备注',
    name: 'remark',
    inputType: 'textarea',
    bisection: 1
  }
];
const options = ref<IFormItem[]>(defaultOptions);
const rules = reactive({
  userName: [
    { required: true, message: '用户名称不能为空' },
    {
      min: 2,
      max: 20,
      message: '用户名称长度必须介于 2 和 20 之间'
    }
  ],
  nickName: [{ required: true, message: '用户昵称不能为空' }],
  password: [
    { required: true, message: '用户密码不能为空' },
    {
      min: 5,
      max: 20,
      message: '用户密码长度必须介于 5 和 20 之间'
    }
  ],
  email: [
    {
      type: 'email',
      message: '请输入正确的邮箱地址'
    }
  ],
  phonenumber: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: '请输入正确的手机号码'
    }
  ]
});
const curUserInfo = ref<any>({});

/**
 * 获取用户角色，职位列表
 * */
const handleUserInfo = async (): void => {
  const { posts = [], roles = [] } = userInfo.value;
  if (posts.length === 0 || roles.length === 0) {
    const res = await getUser('');
    userInfo.value.posts = res.posts;
    userInfo.value.roles = res.roles;
    const [gotItPost, gotItRole] = options.value.filter(
      (option) => option.name === 'postIds' || option.name === 'roleIds'
    );
    gotItPost.treeOptions = res.posts;
    gotItRole.treeOptions = res.roles;
  }
};

const router = useRouter();

// 表单事件操作
const handleActionTables = (type: OptType, record?: unknown = {}): void => {
  optType.value = type;
  if (type === 'add' || type === 'edit') {
    handleUserInfo();
  }
  if (type === 'add') {
    title.value = '添加用户';
    defaultValue.value = {};
    options.value = defaultOptions;
    open.value = true;
    void vwFormRef.value?.resetFields();
  }

  if (type === 'edit') {
    title.value = '修改用户';
    // 隐藏值
    options.value = options.value.filter(
      (option) => option.name !== 'password'
    );
    const { userId } = record;
    getUser(userId).then((res) => {
      // 设置一个default props
      defaultValue.value = record;
      defaultValue.value.roleIds = res.roleIds;
      defaultValue.value.postIds = res.postIds;
      open.value = true;
    });
  }

  if (type === 'delete') {
    let { userId, index } = record;

    if (!userId) {
      if (rowKeys.value.length === 0) {
        void message.warning('请选中至少一条数据进行操作');
        return;
      }
      userId = rowKeys.value.join(',');
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
        delUser(userId).then(() => {
          getList();
        });
      }
    });
  }

  if (type === 'export') {
    download(
      'system/user/export',
      {
        ...formStatus
      },
      `user_${+new Date()}.xlsx`
    );
  }

  if (type === 'import') {
    uploadRef.value.isOpen = true;
  }

  if (type === 'resetPassword') {
    resetPasswordRef.value = true;
    curUserInfo.value = record;
  }

  if (type === 'assignRoles') {
    void router.push(`/system/user-auth/role/${record.userId}`);
  }
};

/**
 * 新增/修改提交
 * */
const modalOk = (): void => {
  void vwFormRef.value?.validate().then(() => {
    let cb = addUser;
    const params = vwFormRef.value.formState;
    if (optType.value === 'edit') {
      params.userId = defaultValue.value.userId;
      cb = updateUser;
    }
    cb(params).then(() => {
      open.value = false;
      getList();
    });
  });
};

/**
 * 导入
 * */
const uploadRef = useImport();
const handleImportChange = (info: UploadChangeParam): void => {
  const status = info.file.status;
  if (status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (status === 'done') {
    void message.success(`${info.file.name} file uploaded successfully.`);
  } else if (status === 'error') {
    void message.error(`${info.file.name} file upload failed.`);
  }
};

/** 下载模板操作 */
const importTemplate = (): void => {
  download(
    'system/user/importTemplate',
    {},
    `user_template_${+new Date()}.xlsx`
  );
};

const resetPasswordRef = ref<boolean>(false);
const resetOptions: IFormItem[] = [
  {
    label: '',
    name: 'password',
    inputType: 'inputPassword',
    bisection: 1
  }
];

const resetRef = ref();
const modalResetOk = (): void => {
  resetUserPwd(
    curUserInfo.value.userId,
    resetRef.value.formState.password
  ).then(() => {
    resetPasswordRef.value = false;
  });
};

onMounted(() => {
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
        v-model:selected-keys="checkedKeys"
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
        @reset-cb="resetCb"
      />
      <a-row class="form-item-margin">
        <a-col>
          <action-table
            :options="['add', 'delete', 'import', 'export']"
            :row-gutter="16"
            :dropdown-length="4"
            @click-cb="handleActionTables"
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
            <dict-tag :value="text" :options="dictObjs['sys_normal_disable']" />
          </template>
          <template v-if="column.dataIndex === 'action'">
            <action-table
              v-if="record.userId !== 1"
              btn-size="small"
              btn-type="link"
              :options="['edit', 'delete', 'resetPassword', 'assignRoles']"
              @click-cb="
                (type) => {
                  handleActionTables(type, { ...record, index: index + 1 });
                }
              "
            />
          </template>
        </template>
      </a-table>
    </a-col>
  </a-row>
  <a-modal
    v-model:open="open"
    :title="title"
    closable
    :width="600"
    @ok="modalOk"
  >
    <v-w-form
      v-if="open"
      ref="vwFormRef"
      :options="options"
      :rules="rules"
      :default-value="defaultValue"
    />
  </a-modal>
  <a-modal v-model:open="uploadRef.isOpen" title="用户导入">
    <a-upload-dragger
      v-model:fileList="fileList"
      name="file"
      :max-count="1"
      accept=".xlsx, .xls"
      :multiple="true"
      :headers="uploadRef.headers"
      :action="uploadRef.url"
      @change="handleImportChange"
    >
      <p class="ant-upload-drag-icon">
        <inbox-outlined />
      </p>
      <div class="ant-upload-text">点击或者拖拽文件到此处上传</div>
    </a-upload-dragger>
    <a-row justify="center" class="import-margin">
      <a-checkbox v-model:checked="uploadRef.updateSupport"
        >是否更新已经存在的用户数据
      </a-checkbox>
    </a-row>
    <a-row justify="center" align="middle">
      仅允许导入xls、xlsx格式文件。
      <a-button type="link" @click="importTemplate">下载模板</a-button>
    </a-row>
  </a-modal>
  <a-modal v-model:open="resetPasswordRef" title="提示" @ok="modalResetOk">
    <div class="reset-bottom">
      请输入"<span>{{ curUserInfo?.userName }}</span
      >"的新密码
    </div>
    <v-w-form v-if="resetPasswordRef" ref="resetRef" :options="resetOptions" />
  </a-modal>
</template>
<style lang="less" scoped>
:deep(.ant-tree) {
  background: none;
}

:deep(.filter-node .ant-tree-title) {
  color: @colorPrimary !important;
}

.form-item-margin {
  margin: 24px 0;
}

.import-margin {
  margin: 16px 0;
}

.reset-bottom {
  margin-bottom: 10px;

  span {
    color: @colorPrimary;
  }
}
</style>
