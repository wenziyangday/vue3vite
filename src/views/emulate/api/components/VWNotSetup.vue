<script lang="ts">
import { onMounted } from 'vue';

export default {
  setup() {
    console.log('VWNotSetup--setup中执行了');
    onMounted(() => {
      console.log('VWNotSetup--setup中执行了onMounted');
    });
    return {
      name: '不是composition方式'
    };
  },
  beforeCreate() {
    console.log('VWNotSetup--组件执行了beforeCreate');
  },
  onMounted() {
    console.log('VWNotSetup--组件执行了onMounted');
  }
};
</script>

<template>
  <h4 class="v-w-item">
    setup: script 标签中没有 setup 而是通过setup() 处理变量函数，写法相近于
    option api （组合式Api）
  </h4>
  <div class="comment-margin">
    <span>说明：</span>
    <div class="comment-desc">
      这种情况下写法相近于 option
      API，在多组件调用或者更复杂的项目下，这种写法变得不那么简洁，反而更加笨重了
    </div>
  </div>
  <div class="title-margin">
    {{ name }}setup 变得更加笨重，而且多种生命周期（setup
    生命周期，组件自身生命周期）会引发代码结构不一致问题
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

.title-margin {
  margin-top: 10px;
}

.v-w-item {
  color: @geekblue;
}
</style>
