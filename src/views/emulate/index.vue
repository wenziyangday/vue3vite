<script setup lang="ts">
import DirectiveCustom from '@/views/emulate/components/DirectiveCustom.vue';
import VWForm from '@/views/emulate/components/VWForm.vue';
import VWFormCom from '@/views/emulate/components/VWFormCom.vue';
import VWLab from '@/views/emulate/components/VWLab.vue';
import VWTree from '@/views/emulate/components/VWTree.vue';
import VWWatch from '@/views/emulate/components/VWWatch.vue';
</script>

<template>
  <div>
    <v-w-tree />
    <a-divider />
    <v-w-watch />
    <a-divider />
    <v-w-form-com />
    <a-divider />
    <v-w-form />
    <a-divider />
    <directive-custom />
    <a-divider />
    <v-w-lab></v-w-lab>
    <a-divider />
  </div>
</template>
