<script setup lang="ts">
import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers/src';
import { MapboxLayer } from '@deck.gl/mapbox/src';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import mapboxgl from 'mapbox-gl';
import { onMounted } from 'vue';

onMounted(() => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidmluY2VudHdlbiIsImEiOiJja2k2c2Z5aGQxdW90MnRuejFjcnR6MG94In0.yCYY_RpjUokkySYdtGVenQ';
  const map = new mapboxgl.Map({
    container: 'mapbox', // 地图所在的容器id
    // style: 'mapbox://styles/mapbox/light-v11',
    // style: 'mapbox://styles/mapbox/streets-v12', // 地图样式
    style: 'mapbox://styles/vincentwen/clm5q1goq00x801pe691mfb1m', // 地图样式
    // style: 'mapbox://styles/mapbox/standard-beta', // 地图样式
    // style: 'mapbox://styles/mapbox/satellite-streets-v12', // 地图样式
    // center: [115.78980816008891, 32.85512758245787], // 地图中心点坐标
    // center: [-122.4, 37.79], // 地图中心点坐标
    // zoom: 14, // 初始缩放级别
    // pitch: 60,
    // bearing: 172.5,
    // antialias: true
    // center: [-87.61694, 41.86625],
    // zoom: 15.99

    center: [115.78980816008891, 32.85512758245787],
    zoom: 15,
    pitch: 60
  });
  map.addControl(
    new MapboxLanguage({
      defaultLanguage: 'zh-Hans'
    })
  );

  map.on('load', () => {
    const firstLabelLayerId = map
      .getStyle()
      .layers.find((layer) => layer.type === 'symbol').id;
    map.addLayer(
      {
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          // use an 'interpolate' expression to add a smooth transition effect to the
          // buildings as the user zooms in
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      },
      firstLabelLayerId
    );

    map.addLayer(
      new MapboxLayer({
        id: 'deckgl-circle',
        type: ScatterplotLayer,
        data: [
          { position: [-122.402, 37.79], color: [255, 0, 0], radius: 1000 }
        ],
        getPosition: (d) => d.position,
        getFillColor: (d) => d.color,
        getRadius: (d) => d.radius,
        opacity: 0.3
      }),
      firstLabelLayerId
    );

    map.addLayer(
      new MapboxLayer({
        id: 'deckgl-arc',
        type: ArcLayer,
        data: [
          {
            source: [-122.3998664, 37.7883697],
            target: [-122.400068, 37.7900503]
          }
        ],
        getSourcePosition: (d) => d.source,
        getTargetPosition: (d) => d.target,
        getSourceColor: [255, 208, 0],
        getTargetColor: [0, 128, 255],
        getWidth: 8
      })
    );
  });

  map.on('click', (event) => {
    console.log(event, 'event');
  });
});
</script>

<template>
  <div class="map" id="mapbox"></div>
</template>

<style scoped lang="less">
.map {
  width: 100vw;
  height: 100vh;
}

.marker {
  width: 50px;
  height: 50px;
  cursor: pointer;
  background-image: url('@/assets/logo.png');
  background-size: cover;
  border-radius: 50%;
}

.mapboxgl-popup {
  max-width: 200px;
}

.mapboxgl-popup-content {
  font-family: 'Open Sans', sans-serif;
  text-align: center;
}
</style>
