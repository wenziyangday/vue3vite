<template>
  <a-button @click="expandAll">展开</a-button>
  <a-switch v-model:checked="expand"></a-switch>
  {{ expand }}
  <a-tree
    :default-expand-all="expand"
    checkable
    :tree-data="arr"
    :field-names="fieldNames"
    :show-line="expand"
  >
    <template #title="{ title, key }">
      <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
      <template v-else>{{ title }}</template>
    </template>
  </a-tree>
</template>
<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';
import { ref, watch } from 'vue';

const fieldNames: TreeProps['fieldNames'] = {
  children: 'children',
  title: 'deptName',
  key: 'deptId'
};
const arr = ref([
  {
    createBy: 'admin',
    createTime: '2023-06-03 06:15:08',
    updateBy: null,
    updateTime: null,
    remark: null,
    deptId: 100,
    parentId: 0,
    ancestors: '0',
    deptName: '若依科技',
    orderNum: 0,
    leader: '若依',
    phone: '15888888888',
    email: 'ry@qq.com',
    status: '0',
    delFlag: '0',
    parentName: null,
    children: [
      {
        createBy: 'admin',
        createTime: '2023-06-03 06:15:08',
        updateBy: null,
        updateTime: null,
        remark: null,
        deptId: 101,
        parentId: 100,
        ancestors: '0,100',
        deptName: '深圳总公司',
        orderNum: 1,
        leader: '若依',
        phone: '15888888888',
        email: 'ry@qq.com',
        status: '0',
        delFlag: '0',
        parentName: null,
        children: [
          {
            createBy: 'admin',
            createTime: '2023-06-03 06:15:08',
            updateBy: null,
            updateTime: null,
            remark: null,
            deptId: 103,
            parentId: 101,
            ancestors: '0,100,101',
            deptName: '研发部门',
            orderNum: 1,
            leader: '若依',
            phone: '15888888888',
            email: 'ry@qq.com',
            status: '0',
            delFlag: '0',
            parentName: null
          },
          {
            createBy: 'admin',
            createTime: '2023-06-03 06:15:08',
            updateBy: null,
            updateTime: null,
            remark: null,
            deptId: 104,
            parentId: 101,
            ancestors: '0,100,101',
            deptName: '市场部门',
            orderNum: 2,
            leader: '若依',
            phone: '15888888888',
            email: 'ry@qq.com',
            status: '1',
            delFlag: '0',
            parentName: null
          },
          {
            createBy: 'admin',
            createTime: '2023-06-03 06:15:08',
            updateBy: null,
            updateTime: null,
            remark: null,
            deptId: 105,
            parentId: 101,
            ancestors: '0,100,101',
            deptName: '测试部门',
            orderNum: 3,
            leader: '若依',
            phone: '15888888888',
            email: 'ry@qq.com',
            status: '0',
            delFlag: '0',
            parentName: null
          },
          {
            createBy: 'admin',
            createTime: '2023-06-03 06:15:08',
            updateBy: null,
            updateTime: null,
            remark: null,
            deptId: 106,
            parentId: 101,
            ancestors: '0,100,101',
            deptName: '财务部门',
            orderNum: 4,
            leader: '若依',
            phone: '15888888888',
            email: 'ry@qq.com',
            status: '0',
            delFlag: '0',
            parentName: null
          },
          {
            createBy: 'admin',
            createTime: '2023-06-03 06:15:08',
            updateBy: null,
            updateTime: null,
            remark: null,
            deptId: 107,
            parentId: 101,
            ancestors: '0,100,101',
            deptName: '运维部门',
            orderNum: 5,
            leader: '若依',
            phone: '15888888888',
            email: 'ry@qq.com',
            status: '0',
            delFlag: '0',
            parentName: null
          }
        ]
      },
      {
        createBy: 'admin',
        createTime: '2023-06-03 06:15:08',
        updateBy: null,
        updateTime: null,
        remark: null,
        deptId: 102,
        parentId: 100,
        ancestors: '0,100',
        deptName: '长沙分公司',
        orderNum: 2,
        leader: '若依',
        phone: '15888888888',
        email: 'ry@qq.com',
        status: '0',
        delFlag: '0',
        parentName: null,
        children: [
          {
            createBy: 'admin',
            createTime: '2023-06-03 06:15:08',
            updateBy: null,
            updateTime: null,
            remark: null,
            deptId: 108,
            parentId: 102,
            ancestors: '0,100,102',
            deptName: '市场部门',
            orderNum: 1,
            leader: '若依',
            phone: '15888888888',
            email: 'ry@qq.com',
            status: '0',
            delFlag: '0',
            parentName: null
          },
          {
            createBy: 'admin',
            createTime: '2023-06-03 06:15:08',
            updateBy: null,
            updateTime: null,
            remark: null,
            deptId: 109,
            parentId: 102,
            ancestors: '0,100,102',
            deptName: '财务部门',
            orderNum: 2,
            leader: '若依',
            phone: '15888888888',
            email: 'ry@qq.com',
            status: '0',
            delFlag: '0',
            parentName: null
          }
        ]
      }
    ]
  }
]);
const expand = ref<boolean>(false);
const dig = (path = '0', level = 3): any[] => {
  const list: TreeProps['treeData'] = [];
  for (let i = 0; i < 10; i += 1) {
    const key = `${path}-${i}`;
    const treeNode: TreeProps['treeData'][number] = {
      title: key,
      key
    };

    if (level > 0) {
      treeNode.children = dig(key, level - 1);
    }

    list.push(treeNode);
  }
  return list;
};
const expandAll = (): void => {
  expand.value = !expand.value;
};

const selectedKeys = ref<string[]>(['0-0-0', '0-0-1']);
const checkedKeys = ref<string[]>(['0-0-0', '0-0-1']);
watch(selectedKeys, () => {
  console.log('selectedKeys', selectedKeys);
});
watch(checkedKeys, () => {
  console.log('checkedKeys', checkedKeys);
});
</script>
