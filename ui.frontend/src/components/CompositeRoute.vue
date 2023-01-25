<template>
  <Page
    v-if="displayPage"
    :component-mapping="componentMapping"
    :cq-children="cqChildren"
    :cq-items="cqItems"
    :cq-items-order="cqItemsOrder"
    :cq-path="cqPath"
    :css-class-names="cssClassNames"
  />
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { Model } from '@adobe/aem-spa-page-model-manager';
  import { useRouter } from 'vue-router';
  import { ComponentMapping, Page, Utils } from 'aem-vue-editable-components';

  interface PageModel extends Model {
    ':type': string;
    id: string;
    ':path': string;
    ':children'?: { [key: string]: PageModel };
  }

  export default defineComponent({
    name: 'CompositeRoute',
    components: {
      Page,
    },
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
    setup(props, context) {
      // console.log('CompositeRoute properties: ', props);
      // console.log('CompositeRoute attributes: ', context.attrs);
    },
    computed: {
      displayPage() {
        let displayPage = false;

        if (this.cqPath) {
          const routePath = `${this.cqPath}.html`;
          const router = useRouter();
          router.addRoute({
            path: routePath,
            component: Page,
            props: {
              cqPath: this.cqPath,
              cqItems: this.cqItems,
              cqItemsOrder: this.cqItemsOrder,
              cqChildren: this.cqChildren,
              componentMapping: this.componentMapping,
              cssClassNames: this.cssClassNames,
            },
          });
        } else {
          displayPage = true;
        }

        return displayPage;
      },
    },
  });
</script>
