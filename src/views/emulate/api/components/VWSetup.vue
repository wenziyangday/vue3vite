<script setup lang="ts">
import { ref } from 'vue';

console.log('我是子组件，并执行了');
const count = ref<number>(0);
const handleCount = (): void => {
  count.value += 10;
};
</script>

<template>
  <h4 class="v-w-item">setup: script setup</h4>
  <div class="comment-margin">
    <span>说明：</span>
    <div class="comment-desc">
      script setup是在单文件组件 (SFC) 中使用组合式 API 的编译时语法糖。
      <br />当同时使用 SFC 与组合式 API 时该语法是默认推荐。 <br />相比于普通的
      script 语法，它具有更多优势： 更少的样板内容，更简洁的代码。 <br />
      能够使用纯 TypeScript 声明 props 和自定义事件。 <br />
      更好的运行时性能
      (其模板会被编译成同一作用域内的渲染函数，避免了渲染上下文代理对象)。
      <br />
      更好的 IDE 类型推导性能 (减少了语言服务器从代码中抽取类型的工作)。
    </div>

    <div class="comment-desc">
      响应式状态需要明确使用响应式 API 来创建。
      <br />和 setup() 函数的返回值一样，ref 在模板中使用的时候会自动解包

      <br />
      script setup 范围里的值也能被直接作为自定义组件的标签名使用

      <br />
      由于组件是通过变量引用而不是基于字符串组件名注册的，在 script setup
      中要使用动态组件的时候，应该使用动态的 :is 来绑定
    </div>
  </div>
  <a-space class="common-margin">
    <a-button size="small" @click="handleCount"> 子组件{{ count }}</a-button>
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
