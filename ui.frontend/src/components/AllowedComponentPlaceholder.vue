<template>
  <div
    :data-cq-data-path="path"
    :data-emptytext="emptyLabel"
    class="aem-AllowedComponent--component cq-placeholder placeholder"
  />
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'AllowedComponentPlaceholder',
    inheritAttrs: false,
    props: {
      emptyLabel: {
        type: String,
        default: 'No allowed components',
      },
      path: {
        type: String,
        default: '',
      },
    },
  });
</script>
