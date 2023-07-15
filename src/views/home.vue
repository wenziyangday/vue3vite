<script setup lang="ts">
const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  }
];
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address'
  }
];
</script>

<template>
  <div class="home">
    <div class="font">这是一个首页</div>
    <a-button type="primary">点击</a-button>
    <a-table :dataSource="dataSource" :columns="columns" />
  </div>
</template>

<style scoped lang="less">
.home {
  background: blanchedalmond;
  //color: @blue-2;
  //font-size: @fontSizeLG;
}
</style>
