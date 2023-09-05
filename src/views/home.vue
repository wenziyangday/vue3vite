<script setup lang="ts">
import useMap from '@/components/map/useMap';

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  }
];
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address'
  }
];
const { mapRef } = useMap('map', (AMap) => {
  const marker = new AMap.Marker({
    icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
    position: [116.405467, 39.907761],
    anchor: 'bottom-center'
  });
  mapRef.value.add(marker);
  mapRef.value.setFitView();
});
const handleMap = (): void => {
  console.log(mapRef.value, 'mapref');
};
</script>

<template>
  <div class="home">
    <a-table :dataSource="dataSource" :columns="columns" />
    <a-button @click="handleMap">点击添加地图</a-button>
    <div class="map-container" id="map"></div>
    <div class="map-container" id="map2"></div>
  </div>
</template>

<style scoped lang="less">
.home {
  font-size: @fontSizeLG;
  color: @blue-2;
}

.map-container {
  width: 800px;
  height: 800px;
  margin-bottom: 20px;
  background: @blue;
}
</style>
