<template>
  <nav :id="id" class="stanley-navigation" itemscope="" role="navigation">
    <ul class="stanley-navigation__group">
      <li
        v-for="item in items"
        :key="item"
        class="stanley-navigation__item stanley-navigation__item--level-0"
      >
        <router-link
          :aria-current="`${item.active === true ? 'page' : false}`"
          :class="`stanley-link stanley-navigation__item-link ${
            item.active === true ? 'stanley-link--active' : ''
          }`"
          :title="item.title"
          :to="`${item.path}.html`"
          >{{ item.title }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
  /* eslint-disable vue/multi-word-component-names */
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'Navigation',
    inheritAttrs: false,
    props: {
      id: {
        type: String,
        default: '',
      },
      items: {
        type: Array,
        required: true,
      },
    },
  });
</script>

<style>
  .stanley-navigation {
    --stanley-link-color: #fff;
    --stanley-link-hover-color: #222;
    --stanley-link-text-transform: uppercase;

    align-items: center;
    display: flex;
    justify-content: flex-end;
    min-block-size: var(--stanley-size-7x);
  }

  .stanley-navigation__group {
    display: flex;
    flex-flow: row nowrap;
    gap: var(--stanley-size-4x);
    list-style: none;
    margin-block: 0;
    margin-inline: 0;
    padding-block: 0;
    padding-inline: 0;
  }

  .stanley-navigation__item:first-child {
    display: none;
  }
</style>
