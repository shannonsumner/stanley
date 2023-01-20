<template>
  <div v-bind="containerProps">
    <component
      :is="childComponent"
      v-for="childComponent of childComponents"
      :key="childComponent.toString()"
    />
    <component
      :is="childPage"
      v-for="childPage of childPages"
      :key="childPage.toString()"
    />
  </div>
</template>

<script lang="ts">
  /* eslint-disable vue/multi-word-component-names */
  import { defineComponent, PropType } from 'vue';
  import { Model } from '@adobe/aem-spa-page-model-manager';
  import { ComponentMapping } from '@adobe/aem-spa-component-mapping';
  import Utils from '@/utils/Utils';
  import classNames from 'classnames';

  interface PageModel extends Model {
    ':type': string;
    id: string;
    ':path': string;
    ':children'?: { [key: string]: PageModel };
  }

  export default defineComponent({
    name: 'Page',
    inheritAttrs: false,
    props: {
      aemNoDecoration: {
        type: Boolean,
        default: false,
      },
      appliedCssClassNames: {
        type: String,
        default: '',
      },
      componentMapping: {
        type: Object as PropType<typeof ComponentMapping>,
        default: new ComponentMapping(),
      },
      cqChildren: {
        type: Object as PropType<{ [key: string]: PageModel }>,
        default: () => {},
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
      cssClassNames: {
        type: String,
        default: '',
      },
      isInEditor: {
        type: Boolean,
        default: Utils.isInEditor(),
      },
    },
    setup(props) {
      // console.log('Page properties: ', props);
    },
    computed: {
      childComponents() {
        return Utils.getChildComponents(
          this.cqPath,
          this.cqItems,
          this.cqItemsOrder,
          (itemKey) => {},
          this.isInEditor,
          true,
          this.componentMapping
        );
      },
      childPages() {
        return Utils.getChildPages(this.cqChildren, this.componentMapping);
      },
      containerProps() {
        const containerProps: { [key: string]: string } = {
          class: classNames('aem-page'),
        };

        if (this.isInEditor) {
          containerProps['data-cq-data-path'] = this.cqPath;
        }

        return containerProps;
      },
    },
  });
</script>

<style>
  @import 'Page.css';
</style>
