<template>
  <div class="stanley-title">
    <component :is="type" aria-level="1" class="stanley-title__text">
      <router-link
        :to="currentRoutePath"
        class="stanley-link stanley-title__link"
        >{{ text }}</router-link
      >
    </component>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'AemTitle',
    inheritAttrs: false,
    props: {
      id: {
        type: String,
        default: '',
      },
      text: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: 'h3',
      },
    },
    computed: {
      currentRoutePath() {
        return this.$route.path;
      },
    },
  });
</script>

<style>
  .stanley-title {
    --stanley-link-text-transform: uppercase;
  }
</style>
