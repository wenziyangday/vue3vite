<script setup lang="ts">
import MyComponent from '@/views/emulate/api/components/VWDComponent';
</script>

<template>
  <h4 class="v-w-item">
    defineComponent: 在定义 Vue 组件时提供类型推导的辅助函数。
  </h4>

  <my-component msg="测试一下" />

  <h4 class="v-w-item">
    defineAsyncComponent:
    定义一个异步组件，它在运行时是懒加载的。参数可以是一个异步加载函数，或是对加载行为进行更具体定制的一个选项对象。
  </h4>
</template>

<style lang="less" scoped>
.common-margin {
  margin: 10px 0 14px;
}

.desc-margin {
  line-height: 1.5;
}

.comment-desc {
  padding-left: 15px;
  margin-top: 5px;
  line-height: 1.5;
}

.v-w-item {
  color: @geekblue;
}
</style>
