<script setup lang="ts">
import { message, type TableColumnsType } from 'ant-design-vue';
import { computed, onMounted, onUpdated, ref } from 'vue';
import { useRouter } from 'vue-router';

import { getAuthRole, updateAuthRole } from '@/apis/system/user';
import VWForm from '@/components/table/form/VWForm.vue';
import TitleLine from '@/components/title-line/TitleLine.vue';
import useTableRequest from '@/plugins/hooks/useTableRequest';
import { type IFormItem } from '@/types/opts';

const options = ref<IFormItem[]>([
  {
    label: '用户昵称',
    name: 'nickName'
  },
  {
    label: '登录账号',
    name: 'userName'
  }
]);
const defaultValue = ref<Record<string, unknown>>({});
const dataSource = ref<unknown[]>([]);
const router = useRouter();
const { rowKeys, handleChangeSelection } = useTableRequest();
const handleAuthRole = (): void => {
  const { userId } = router.currentRoute.value.params;
  getAuthRole(userId).then((res) => {
    defaultValue.value = res.user;
    dataSource.value = res.roles;

    // 选中的按钮
    rowKeys.value = res.roles
      .filter((role) => role.flag)
      .map((role) => {
        return role.roleId;
      });
  });
};

const columns = ref<TableColumnsType[]>([
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index'
  },
  {
    title: '角色编号',
    dataIndex: 'roleId',
    key: 'roleId'
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
    key: 'roleName'
  },
  {
    title: '权限字符',
    dataIndex: 'roleKey',
    key: 'roleKey'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }
]);
const columnsGetters = computed(() =>
  columns.value.map((column) => ({
    ...column,
    align: 'center'
  }))
);

// 返回
const handleBack = (): void => {
  router.back();
};

// 提交
const handleAuthConfirm = (): void => {
  const { userId } = router.currentRoute.value.params;
  updateAuthRole({ userId, roleIds: rowKeys.value.join(',') }).then(() => {
    handleBack();
  });
};

onMounted(() => {
  handleAuthRole();
});
</script>

<template>
  <title-line msg="基本信息" />
  <v-w-form
    v-if="Object.keys(defaultValue).length > 0"
    class="form-bottom"
    :options="options"
    :default-value="defaultValue"
    disabled
  />
  <title-line msg="角色信息" />
  <a-table
    :columns="columnsGetters"
    :data-source="dataSource"
    row-key="roleId"
    :row-selection="{
      // 设置默认选中项
      selectedRowKeys: rowKeys,
      onChange: handleChangeSelection
    }"
  >
    <template #bodyCell="{ index, column }">
      <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
    </template>
  </a-table>
  <a-row justify="center" :gutter="16">
    <a-col>
      <a-button type="primary" @click="handleAuthConfirm">提交</a-button>
    </a-col>
    <a-col>
      <a-button @click="handleBack">返回</a-button>
    </a-col>
  </a-row>
</template>

<style lang="less" scoped>
.form-bottom {
  margin-bottom: 20px;
}
</style>
