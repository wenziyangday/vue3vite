<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal, type TableColumnsType } from 'ant-design-vue';
import { computed, createVNode, h, inject, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  allocatedUserList,
  authUserCancel,
  authUserCancelAll,
  authUserSelectAll,
  unallocatedUserList
} from '@/apis/system/role';
import ActionTable from '@/components/action-table/ActionTable.vue';
import ConfirmContent from '@/components/confirm-content/ConfirmContent.vue';
import DictTag from '@/components/dict-tag/DictTag.vue';
import Search from '@/components/table/search/Search.vue';
import keyProvide from '@/constants/keyProvide';
import useTableRequest from '@/plugins/hooks/useTableRequest';
import { type IOptSearch } from '@/types/opts';

/**
 * 全局方法使用
 * */
const dictInject = inject(keyProvide.$getDict);
dictInject(['sys_normal_disable']);
const dictObjs = inject(keyProvide.dictObjs);
const router = useRouter();

// 搜索表单项
const searchOptions = ref<IOptSearch[]>([
  { label: '用户名称', name: 'userName' },
  { label: '手机号码', name: 'phonenumber' }
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
    key: 'userName'
  },
  {
    title: '用户昵称',
    dataIndex: 'nickName',
    key: 'nickName'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '手机',
    dataIndex: 'phonenumber',
    key: 'phonenumber'
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

const { roleId } = router.currentRoute.value.params;

const {
  dataSource,
  formStatus,
  rowKeys,
  paginationIndicator,
  handleChangeSelection,
  handleChange,
  getList,
  searchCb
} = useTableRequest(allocatedUserList, 'rows', { roleId });

// 重置检索表单
const resetCb = (): void => {
  formStatus.value = {};
  getList();
};

// 新增
const open = ref<boolean>(false);
const modalColumns = computed(() =>
  columnsGetters.value.filter((column) => column.key !== 'action')
);

const {
  dataSource: modalDS,
  formStatus: modalFS,
  rowKeys: modalRK,
  paginationIndicator: modalPI,
  handleChangeSelection: modalHandleCS,
  handleChange: modalHandleC,
  getList: modalList,
  searchCb: modalSCB
} = useTableRequest(unallocatedUserList, 'rows', { roleId }, true);

const handleAdd = async (): void => {
  modalFS.value = {};
  await modalList();
  open.value = true;
};

// 弹窗确定
const modalOk = (): void => {
  if (modalRK.value.length === 0) {
    void message.warning('请选中至少一条数据进行操作');
    return;
  }
  authUserSelectAll({ roleId, userIds: modalRK.value.join(',') }).then(() => {
    open.value = false;
    getList();
  });
};

const resetModalCb = (): void => {
  modalFS.value = {};
  modalList();
};

// 批量/取消授权
const cancelAuth = (record?: unknown): void => {
  if (!record.userId && rowKeys.value.length === 0) {
    void message.warning('请选中至少一条数据进行操作');
    return;
  }

  Modal.confirm({
    title: '系统提示',
    closable: true,
    icon: () => {},
    content: h('div', [
      createVNode(ExclamationCircleOutlined),
      createVNode(ConfirmContent, {
        icon: 'delete-outlined',
        word: '取消授权该用户？'
      })
    ]),
    okText: '确认',
    onOk: () => {
      // 要return 否则 Unhandled error during execution of transition hook
      if (record.userId) {
        return authUserCancel({ roleId, userId: record.userId }).then(() => {
          getList();
        });
      }

      return authUserCancelAll({
        roleId,
        userIds: rowKeys.value.join(',')
      }).then(() => {
        getList();
      });
    }
  });
};

// 关闭
const handleClose = (): void => {
  router.back();
};
</script>

<template>
  <search :options="searchOptions" @search-cb="searchCb" @reset-cb="resetCb" />
  <a-row class="form-item-margin">
    <a-col>
      <action-table
        :options="['add']"
        :row-gutter="16"
        :dropdown-length="1"
        @click-cb="handleAdd"
      >
        <template #opt="slot">
          <a-col :span="1.5">
            <a-button :size="slot.size" :type="slot.type" @click="cancelAuth">
              <template #icon>
                <close-circle-outlined />
              </template>
              <span style="margin-left: 4px">批量取消授权</span>
            </a-button>
          </a-col>
          <a-col :span="1.5">
            <a-button :size="slot.size" :type="slot.type" @click="handleClose">
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
    row-key="userId"
    :row-selection="{
      onChange: handleChangeSelection,
      selectedKeys: rowKeys
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
          v-if="record.roleId !== 1"
          btn-size="small"
          btn-type="link"
          :options="['']"
        >
          <template #opt="slot">
            <a-col :span="1.5">
              <a-button
                :size="slot.size"
                :type="slot.type"
                @click="cancelAuth(record)"
              >
                <template #icon>
                  <close-circle-outlined />
                </template>
                <span style="margin-left: 4px">取消授权</span>
              </a-button>
            </a-col>
          </template>
        </action-table>
      </template>
    </template>
  </a-table>
  <a-modal v-model:open="open" title="添加用户" :width="1000" @ok="modalOk">
    <template v-if="open">
      <search
        :options="searchOptions"
        :dropdown-length="2"
        @search-cb="modalSCB"
        @reset-cb="resetModalCb"
      />
      <a-table
        style="margin: 10px 0"
        :columns="modalColumns"
        :data-source="modalDS"
        :pagination="modalPI"
        :scroll="{ y: 220 }"
        row-key="userId"
        size="small"
        :row-selection="{
          onChange: modalHandleCS,
          selectedKeys: modalRK
        }"
        @change="modalHandleC"
      >
        <template #bodyCell="{ column, index, text }">
          <template v-if="column.dataIndex === 'index'"
            >{{ index + 1 }}
          </template>
          <template v-if="column.dataIndex === 'status'">
            <dict-tag :value="text" :options="dictObjs['sys_normal_disable']" />
          </template>
        </template>
      </a-table>
    </template>
  </a-modal>
</template>
<style lang="less" scoped>
:deep(.margin-top-table) {
  margin-top: 16px;
}
</style>
