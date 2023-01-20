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
  import Page from '@/components/Page.vue';
  import { ComponentMapping } from '@adobe/aem-spa-component-mapping';
  import { Model } from '@adobe/aem-spa-page-model-manager';
  import { useRouter } from 'vue-router';
  import Utils from '@/utils/Utils';

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

      let displayPage = false;
      if (props.cqPath) {
        const routePath = `${props.cqPath}.html`;
        const router = useRouter();
        router.addRoute({
          path: routePath,
          component: Page,
          props: {
            cqPath: props.cqPath,
            cqItems: props.cqItems,
            cqItemsOrder: props.cqItemsOrder,
            cqChildren: props.cqChildren,
            componentMapping: props.componentMapping,
            cssClassNames: props.cssClassNames,
          },
        });
      } else {
        displayPage = true;
      }

      return { displayPage };
    },
  });
</script>
