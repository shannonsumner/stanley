<template>
  <div class="stanley-image">
    <img
      :id="id"
      :alt="alt"
      :src="`http://localhost:4502${src}`"
      class="stanley-image__image"
    /><span class="stanley-image__title" itemprop="caption">{{ alt }}</span>
  </div>
</template>

<script lang="ts">
  /* eslint-disable no-unsafe-optional-chaining */
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'AemImage',
    inheritAttrs: false,
    props: {
      id: {
        type: String,
        default: '',
      },
      alt: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
      src: {
        type: String,
        required: true,
      },
    },
  });
</script>

<style>
  .stanley-image__image {
    block-size: auto;
    inline-size: 100%;
    object-fit: cover;
  }
</style>
