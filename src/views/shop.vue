<script setup lang="ts">
import { useShop } from '@/stores/shop';

const shop = useShop();
</script>

<template>
  <div class="shop">
    这是一个商店页
    <div>店铺名称：{{ shop.name }}</div>
    <div>随机店铺: {{ shop.randomName }}</div>
    <div>
      <button @click="shop.updName()">点击更新：</button>
    </div>
  </div>
</template>

<style scoped>
.shop {
  background: beige;
}
</style>
