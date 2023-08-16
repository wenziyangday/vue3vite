<script lang="ts" setup>
import { createFromIconfontCN } from '@ant-design/icons-vue';
import { ref } from 'vue';

import constants from '@/constants/constants';

const IconFont = createFromIconfontCN({
  scriptUrl: constants.iconFontJsUrl
});

const props = withDefaults(
  defineProps<{
    type: string | undefined;
    fontSize?: number;
    fontColor?: string;
  }>(),
  {
    fontSize: 12,
    fontColor: '#000000'
  }
);

const style = ref({ fontSize: `${props.fontSize}px`, color: props.fontColor });
</script>
<template>
  <icon-font :type="type" :style="style" />
</template>
