<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    echartsId: string;
    options: any;
  }>(),
  { echartsId: 'container', options: {} }
);

const vwEcharts = ref<any>();

onMounted(() => {
  vwEcharts.value = echarts.init(
    document.getElementById(props.echartsId),
    'macarons'
  );
  vwEcharts.value?.setOption(props.options);
});
</script>

<template>
  <div class="echarts-container" :id="echartsId"></div>
</template>

<style scoped lang="less">
.echarts-container {
  width: 100%;
  height: 100%;
}
</style>
