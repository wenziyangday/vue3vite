<script setup lang="ts">
import { ref } from 'vue';

import VWDefineExpose from '@/views/emulate/api/components/VWDefineExpose.vue';

const props = withDefaults(
  defineProps<{
    msg?: string;
  }>(),
  {
    msg: '接收参数props'
  }
);
const exposeRef = ref<string>('');

const emit = defineEmits<{
  change: [id: number];
}>();

const handleRef = (): void => {
  console.log(exposeRef.value, 'exposeRef');
};

const handleEmit = (): void => {
  emit('change', '抛出事件emit');
};
</script>

<template>
  <h4 class="v-w-item">组件通信：defineProps && defineProps</h4>
  <a-space class="common-margin">
    <a-button size="small" @click="handleEmit">
      基本数据类型{{ msg }}
    </a-button>
  </a-space>
  <a-divider />

  <h4 class="v-w-item">组件通信：provide && inject</h4>
  <a-divider />

  <h4 class="v-w-item">
    组件通信：defineExpose(结合ref，获取组件的方法或者属性变量，否则，不能获取子组件的方法或者属性)
  </h4>
  <v-w-define-expose ref="exposeRef" />
  <a-space class="common-margin">
    <a-button size="small" @click="handleRef"> defineExpose 测试</a-button>
  </a-space>
  <div class="comment-margin">
    <span>说明：</span>
    <div class="comment-desc">
      使用 script setup 的组件是默认关闭的——即通过模板引用或者 $parent
      链获取到的组件的公开实例，不会暴露任何在 script setup 中声明的绑定。
      <br />
      可以通过 defineExpose 编译器宏来显式指定在 script setup
      组件中要暴露出去的属性：
    </div>
  </div>
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
