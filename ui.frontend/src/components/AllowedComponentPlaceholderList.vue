<template>
  <div :class="placeholderClassNames">
    <div :data-text="listLabel" class="aem-AllowedComponent--list">
      <AllowedComponentPlaceholder
        v-for="component of components"
        :key="component.toString()"
        :empty-label="component.title"
        :path="component.path"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import AllowedComponentPlaceholder from '@/components/AllowedComponentPlaceholder.vue';
  import classNames from 'classnames';

  interface AllowedComponent {
    path: string;
    title: string;
  }

  interface PlaceHolderModel extends Object {
    placeholderClassNames: string;
    cqPath: string;
  }

  export default defineComponent({
    name: 'AllowedComponentsPlaceholderList',
    components: {
      AllowedComponentPlaceholder,
    },
    inheritAttrs: false,
    props: {
      components: {
        type: Array as PropType<Array<AllowedComponent>>,
        default: () => [],
      },
      cqPath: {
        type: String,
        default: '',
      },
      emptyLabel: {
        type: String,
        default: 'No allowed components',
      },
      placeholderProps: {
        type: Object as PropType<PlaceHolderModel>,
        default: () => {},
      },
      title: {
        type: String,
        default: 'Layout Container',
      },
    },
    computed: {
      listLabel() {
        return this.components && this.components.length > 0
          ? this.title
          : this.emptyLabel;
      },
      placeholderClassNames() {
        return classNames(
          'aem-AllowedComponent--list',
          this.placeholderProps?.placeholderClassNames
        );
      },
    },
  });
</script>
