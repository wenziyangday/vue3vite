<template>
  <a-result
    status="500"
    title="500"
    sub-title="Sorry, the server is wrong."
    class="height"
  >
    <template #extra>
      <a-button type="primary">Back Home</a-button>
    </template>
  </a-result>
</template>
<style lang="less" scoped>
.height {
  height: 100vh;
}
</style>
