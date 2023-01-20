<template>
  <div
    v-if="richText"
    :id="modelId"
    data-rte-editelement
    v-html="`${sanitize(text)}`"
  ></div>
  <div v-else :id="modelId" data-rte-editelement="true" v-text="text"></div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import DOMPurify from 'dompurify';
  import Utils from '@/utils/Utils';

  export default defineComponent({
    name: 'AemText',
    inheritAttrs: false,
    props: {
      cqPath: {
        type: String,
        default: '',
      },
      richText: {
        type: Boolean,
        default: false,
      },
      text: {
        type: String,
        default: '',
      },
    },
    setup() {
      const { sanitize } = DOMPurify;

      return { sanitize };
    },
    computed: {
      modelId() {
        return Utils.extractModelId(this.cqPath);
      },
    },
  });
</script>
