<template>
  <header class="stanley-header" role="banner">
    <router-link :to="homePage" class="stanley-link stanley-header__logo"
      >Stanley</router-link
    >
  </header>
</template>

<script lang="ts">
  /* eslint-disable no-unsafe-optional-chaining */
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'AemHeader',
    inheritAttrs: false,
    props: {
      homePage: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      // console.log('AemHeader properties: ', props);
    },
  });
</script>

<style>
  .stanley-header {
    --stanley-link-text-transform: uppercase;
  }

  .stanley-header__logo {
    --stanley-link-color: #fff;
    --stanley-link-hover-color: #fff;

    color: #fff;
    display: block;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 2px;
    padding-block: var(--stanley-size-2x);
  }
</style>
