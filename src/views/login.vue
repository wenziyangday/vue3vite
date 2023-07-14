<script setup lang="ts">
const data: any = { name: '张三' };
</script>

<template>
  <div class="login">这是一个登录页{{ data.name }}</div>
</template>

<style scoped>
.login {
  background: aliceblue;
}
</style>
