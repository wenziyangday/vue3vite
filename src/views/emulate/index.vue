<script setup lang="ts">
import { ref } from 'vue';

import VWIconFont from '@/components/icon-font/VWIconFont.vue';
import DirectiveCustom from '@/views/emulate/components/DirectiveCustom.vue';
import VWFile from '@/views/emulate/components/VWFile.vue';
import VWForm from '@/views/emulate/components/VWForm.vue';
import VWFormCom from '@/views/emulate/components/VWFormCom.vue';
import VWLab from '@/views/emulate/components/VWLab.vue';
import VWRef from '@/views/emulate/components/VWRef.vue';
import VWSeed from '@/views/emulate/components/VWSeed.vue';
import VWTree from '@/views/emulate/components/VWTree.vue';
import VWWatch from '@/views/emulate/components/VWWatch.vue';

const refd = ref('edit');
</script>

<template>
  <div>
    <a-divider title="带图标下拉" />
    <a-select style="width: 100%">
      <a-select-option value="lucy">
        <logout-outlined />
        <v-w-icon-font :type="refd" />
        edit
      </a-select-option>
    </a-select>
    <a-divider title="网络数据" />
    <v-w-file />
    <a-divider title="网络数据" />
    <v-w-ref />
    <a-divider title="响应式数据" />
    <v-w-seed />
    <a-divider title="树形tree" />
    <v-w-tree />
    <a-divider title="watch侦听器" />
    <v-w-watch />
    <a-divider title="自定义表单" />
    <v-w-form-com />
    <a-divider title="自定义表单" />
    <v-w-form />
    <a-divider title="自定义指令" />
    <directive-custom />
    <a-divider title="实验" />
    <v-w-lab></v-w-lab>
    <a-divider />
  </div>
</template>
