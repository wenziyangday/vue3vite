<script setup lang="ts">
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';

// you can use both themes at the same time and use them interchangeably
import { QuillEditor } from '@vueup/vue-quill';
</script>

<template>
  <quill-editor theme="snow"></quill-editor>
</template>
