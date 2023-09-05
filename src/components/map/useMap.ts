import AMapLoader from '@amap/amap-jsapi-loader';
import { onMounted, onUnmounted, ref } from 'vue';

const useMap = function (mapId: string, cb?): unknown {
  const mapRef = ref<any>();
  onMounted(() => {
    void AMapLoader.load({
      key: 'd416a40efc4f82e0be7abad5e853de59', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [],
      AMapUI: {
        // 是否加载 AMapUI，缺省不加载
        version: '1.1', // AMapUI 版本
        plugins: ['overlay/SimpleMarker'] // 需要加载的 AMapUI ui插件
      }
    }).then((AMap) => {
      mapRef.value = new AMap.Map(mapId, {
        // 设置地图容器id
        viewMode: '3D', // 是否为3D地图模式
        zoom: 5, // 初始化地图级别
        center: [105.602725, 37.076636] // 初始化地图中心点位置
      });
      cb(AMap);
    });
  });

  onUnmounted(() => {
    mapRef.value?.destroy();
  });

  return {
    mapRef
  };
};

export default useMap;
