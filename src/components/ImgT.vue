<template>
  <div class="my-demo">
    <img id="img" src="@/assets/logo.png" alt="" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

import useBase64 from '@/plugins/utils/useHooks';
export default defineComponent({
  setup() {
    void useBase64({
      el: '#img'
    }).then((res) => {
      console.log('Base64 格式的图片 ----', res.Baseurl);
    });

    const state = reactive({});
    console.log(toRefs(state));
    return {
      ...toRefs(state)
    };
  }
});
</script>
