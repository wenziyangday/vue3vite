<script setup lang="ts">
import { onMounted, onUnmounted, onUpdated, ref } from 'vue';

console.log('我是子组件，并执行了');

// 一个奇怪的现象 begin--------
const color = ref<string>('#ccc');
const colorRef = ref<string>('color');
// 一个奇怪的现象 end--------

const handleColor = (): void => {
  const random = parseInt(Math.random() * 255, 10);
  color.value = `rgba(${random}, ${random}, ${random}, 1)`;

  console.log('我是子组件--colorRef--我执行了', colorRef.value);
};

onMounted(() => {
  console.log('我是子组件--onMounted--我执行了');
});

onUnmounted(() => {
  console.log('我是子组件--onUnmounted--我执行了');
});

onUpdated(() => {
  console.log('我是子组件--onUpdated--我执行了', color.value);
});
</script>

<template>
  <h4 class="v-w-item">onMounted: 注册一个回调函数，在组件挂载完成后执行。</h4>
  <div class="comment-margin">
    <span>说明：</span>
    <div class="comment-desc">
      组件在以下情况下被视为已挂载：<br />
      其所有<span>同步子组件</span>都已经被挂载 (不包含异步组件或 Suspense
      树内的组件)。<br />
      其自身的 DOM 树
      <span>已经创建</span
      >完成并插入了父容器中。注意仅当根容器在文档中时，才可以保证组件 DOM
      树也在文档中。<br />
      这个钩子通常用于执行需要访问组件所渲染的 DOM
      树相关的副作用，或是在服务端渲染应用中用于确保 DOM
      相关代码仅在客户端执行。<br />
      这个钩子在服务器端渲染期间不会被调用。
    </div>
  </div>
  <a-divider></a-divider>

  <h4 class="v-w-item" :style="{ background: color }" :ref="colorRef">
    onUpdated: 注册一个回调函数，在组件因为响应式状态变更而更新其 DOM
    树之后调用。
  </h4>
  <div class="comment-margin">
    <span>说明：</span>
    <div class="comment-desc">
      父组件的更新钩子将在其子组件的更新钩子之后调用。 <br />
      这个钩子会在组件的
      <span> 任意 DOM 更新 </span>
      后被调用，这些更新可能是由不同的状态变更导致的，因为多个状态变更可以在同一个渲染周期中批量执行（考虑到性能因素）。
      <br />如果你需要在某个特定的状态更改后访问更新后的 DOM，请使用 nextTick()
      作为替代。
    </div>
    <span>warning：</span>
    <div class="comment-desc">
      不要在 updated 钩子中更改组件的状态，这可能会导致无限的更新循环！
    </div>
  </div>
  <a-space class="common-margin">
    <a-button size="small" @click="handleColor"> 子组件: {{ color }}</a-button>
  </a-space>
  <a-divider></a-divider>

  <h4 class="v-w-item">
    onUnmounted: 注册一个回调函数，在组件实例被卸载之后调用。
  </h4>
  <div class="comment-margin">
    <span>说明：</span>
    <div class="comment-desc">
      一个组件在以下情况下被视为已卸载：
      <span>(子组件，响应式作用，事件监听)</span>
      <br />
      其所有子组件都已经被卸载。<br />
      所有相关的响应式作用 (渲染作用以及 setup() 时创建的计算属性和侦听器)
      都已经停止。<br />
      可以在这个钩子中手动清理一些副作用，例如计时器、DOM
      事件监听器或者与服务器的连接。<br />
      这个钩子在服务器端渲染期间不会被调用。
    </div>
  </div>
  <a-divider></a-divider>

  <h4 class="v-w-item">
    onErrorCaptured: 注册一个钩子，在捕获了后代组件传递的错误时调用。
  </h4>
  <div class="comment-margin">
    <span>说明：</span>
    <div class="comment-desc">
      错误可以从以下几个来源中捕获： <br />

      组件渲染 <br />
      事件处理器 <br />
      生命周期钩子 <br />
      setup() 函数 <br />
      侦听器 <br />
      自定义指令钩子 <br />
      过渡钩子 <br />

      这个钩子带有三个实参：错误对象、触发该错误的组件实例，以及一个说明错误来源类型的信息字符串。<br />
      你可以在 errorCaptured()
      （还有一个处理全局error的方式app.config.errorHandler）
      中更改组件状态来为用户显示一个错误状态。注意不要让错误状态再次渲染导致本次错误的内容，否则组件会陷入无限循环。<br />
      这个钩子可以通过返回 false
      来阻止错误继续向上传递。请看下方的传递细节介绍。
    </div>
    <br />
    <span>错误传递规则:</span>
    <div class="comment-desc">
      默认情况下，所有的错误都会被发送到应用级的 app.config.errorHandler
      (前提是这个函数已经定义)，这样这些错误都能在一个统一的地方报告给分析服务。<br />

      如果组件的继承链或组件链上存在多个 errorCaptured
      钩子，对于同一个错误，这些钩子会被按从底至上的顺序一一调用。这个过程被称为“向上传递”，类似于原生
      DOM 事件的冒泡机制。<br />

      如果 errorCaptured
      钩子本身抛出了一个错误，那么这个错误和原来捕获到的错误都将被发送到
      app.config.errorHandler。<br />

      errorCaptured 钩子可以通过返回 false
      来阻止错误继续向上传递。即表示“这个错误已经被处理了，应当被忽略”，它将阻止其他的
      errorCaptured 钩子或 app.config.errorHandler 因这个错误而被调用。<br />
    </div>
  </div>
  <a-divider></a-divider>

  <h4 class="v-w-item">
    onActivated && onDeactivated: 注册一个回调函数，若组件实例是 KeepAlive
    缓存树的一部分，当组件被插入/被移除 DOM 中时调用。
  </h4>
</template>
<style lang="less" scoped>
.common-margin {
  margin: 10px 0 14px;
}

.desc-margin {
  line-height: 1.5;
}

.comment-margin {
  margin-bottom: 10px;
}

.comment-desc {
  padding-left: 15px;
  margin-top: 5px;
  line-height: 1.5;

  span {
    color: @blue;
  }
}

.v-w-item {
  color: @geekblue;
}
</style>
