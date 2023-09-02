<script setup lang="ts">
import { ref } from 'vue';

const radius = ref<string>('测试跳出编译');
</script>

<template>
  <h4 class="v-w-item">
    指令的作用是：当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM。
  </h4>
  <h6 class="desc-margin" v-hasPermission="12">
    v-memo:缓存一个模板的子树。在元素和组件上都可以使用。为了实现缓存，该指令需要传入一个固定长度的依赖值数组进行比较。
    <br />如果数组里的每个值都与最后一次的渲染相同，那么整个子树的更新将被跳过。
  </h6>

  <div class="comment-margin">
    <span>应用场景：与 v-for 一起使用</span>
    <div class="comment-desc">
      当搭配 v-for 使用 v-memo，确保两者都绑定在同一个元素上。v-memo 不能用在
      v-for 内部。
    </div>
  </div>
  <h6 class="desc-margin" v-hasPermission="12">
    v-pre: 跳过该元素及其所有子元素的编译。
  </h6>
  <div class="comment-margin">
    <span>说明：</span>
    <div class="comment-desc">
      元素内具有 v-pre，所有 Vue
      模板语法都会被保留并按原样渲染。最常见的用例就是显示原始双大括号标签及内容。
    </div>
  </div>
  <a-space v-pre>
    <div class="common-margin">{{ radius }}</div>
  </a-space>
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
