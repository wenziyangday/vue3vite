<script setup lang="ts">
import { ref } from 'vue';

import VWForm from '@/components/table/form/VWForm.vue';
import { type IFormItem } from '@/types/opts';

const options = ref<IFormItem[]>([
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
]);
</script>

<template>
  <v-w-form :options="options" :bisection="4" />
</template>
