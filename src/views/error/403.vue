<template>
  <a-result
    status="403"
    title="403"
    sub-title="Sorry, you are not authorized to access this page."
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
