<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import ScriptNotSetUp from './components/ScriptNotSetUp.vue'
import ReactiveCom from './study/Reactive.vue'

const env = import.meta.env
console.log(env, 'env')
const aa = 1111
</script>

<template>
  <hello-world msg="生命周期"/>
  <my-btn msg="我是一个全局的组件"/>
  <script-not-set-up msg="script 不使用setup 属性"/>
  <reactive-com/>
</template>
