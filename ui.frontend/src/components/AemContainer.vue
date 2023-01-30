<template>
  <AllowedComponentsContainer
    v-if="showAllowedComponentPlaceholderList"
    v-bind="$props"
  />
  <div v-else class="container responsivegrid">
    <div :id="id" ref="mainDiv" :class="baseCssClass">
      <Container
        v-if="layout === 'simple'"
        :component-mapping="componentMapping"
        :cq-force-reload="cqForceReload"
        :cq-items="cqItems"
        :cq-items-order="cqItemsOrder"
        :cq-path="cqPath"
        :is-in-editor="false"
      />
      <ResponsiveGrid v-else v-bind="gridProps" />
      <ContainerPlaceholder v-if="isInEditor" v-bind="placeholderProps" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import {
    AllowedComponentsContainer,
    ComponentMapping,
    Container,
    ContainerPlaceholder,
    ResponsiveGrid,
    Utils,
  } from 'aem-vue-editable-components';
  import { Model } from '@adobe/aem-spa-page-model-manager';

  interface AllowedComponent {
    path: string;
    title: string;
  }

  interface AllowedComponents {
    /**
     * Should AllowedComponents list be applied.
     */
    applicable: boolean;
    components: AllowedComponent[];
  }

  export default defineComponent({
    name: 'AemContainer',
    components: {
      AllowedComponentsContainer,
      Container,
      ContainerPlaceholder,
      ResponsiveGrid,
    },
    inheritAttrs: false,
    props: {
      _allowedComponentPlaceholderListEmptyLabel: {
        type: String,
        default: 'No allowed components',
      },
      aemNoDecoration: {
        type: Boolean,
        default: false,
      },
      allowedComponents: {
        type: Object as PropType<AllowedComponents>,
        default: () => {},
      },
      appliedCssClassNames: {
        type: String,
        default: '',
      },
      backgroundStyle: {
        type: String,
        default: '',
      },
      baseCssClass: {
        type: String,
        default: 'cmp-container',
      },
      columnClassNames: {
        type: Object as PropType<{ [key: string]: string }>,
        default: () => {},
      },
      componentMapping: {
        type: Object as PropType<typeof ComponentMapping>,
        default: new ComponentMapping(),
      },
      cqForceReload: {
        type: Boolean,
        default: false,
      },
      cqItems: {
        type: Object as PropType<{
          [key: string]: Model;
        }>,
        required: true,
      },
      cqItemsOrder: {
        type: Array as PropType<Array<string>>,
        required: true,
      },
      cqPath: {
        type: String,
        default: '',
      },
      gridClassNames: {
        type: String,
        default: '',
      },
      id: {
        type: String,
        default: '',
      },
      isInEditor: {
        type: Boolean,
        default: Utils.isInEditor(),
      },
      layout: {
        type: String,
        default: 'responsiveGrid',
        validator: (prop: string) =>
          ['responsiveGrid', 'simple'].includes(prop),
      },
      title: {
        type: String,
        default: 'Layout Container',
      },
    },
    computed: {
      gridProps() {
        return {
          allowedComponents: { applicable: false, components: [] },
          componentMapping: this.componentMapping,
          gridClassNames: this.gridClassNames,
          columnClassNames: this.columnClassNames,
          cqItems: this.cqItems,
          cqItemsOrder: this.cqItemsOrder,
          title: '',
          cqPath: this.cqPath,
          isInEditor: false,
        };
      },
      showAllowedComponentPlaceholderList() {
        return (
          this.isInEditor &&
          this.allowedComponents &&
          this.allowedComponents.applicable
        );
      },
      placeholderProps() {
        return {
          cqPath: this.cqPath,
          placeholderClassNames: ['new', 'section'],
        };
      },
    },
    mounted() {
      if (this.$refs.mainDiv && this.backgroundStyle) {
        (this.$refs.mainDiv as HTMLElement).setAttribute(
          'style',
          this.backgroundStyle
        );
      }
    },
    updated() {
      if (this.$refs.mainDiv && this.backgroundStyle) {
        (this.$refs.mainDiv as HTMLElement).setAttribute(
          'style',
          this.backgroundStyle
        );
      }
    },
  });
</script>
