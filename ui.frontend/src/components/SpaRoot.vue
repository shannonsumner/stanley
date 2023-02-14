<template>
  <div>
    <router-view></router-view>
    <component
      :is="childComponent"
      v-for="childComponent of childComponents"
      :key="childComponent.toString()"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { Model } from '@adobe/aem-spa-page-model-manager';
  import { ComponentMapping, Utils } from 'aem-vue-editable-components';

  interface PageModel extends Model {
    ':type': string;
    id: string;
    ':path': string;
    ':children'?: { [key: string]: PageModel };
  }

  export default defineComponent({
    name: 'SpaRoot',
    inheritAttrs: false,
    props: {
      componentMapping: {
        type: Object as PropType<typeof ComponentMapping>,
        default: new ComponentMapping(),
      },
      cqChildren: {
        type: Object as PropType<{ [key: string]: PageModel }>,
        required: true,
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
      isInEditor: {
        type: Boolean,
        default: Utils.isInEditor(),
      },
      locationPathname: {
        type: String,
        default: window.location.pathname,
      },
    },
    setup(props) {
      // console.log('SpaRoot properties: ', props);
    },
    computed: {
      childComponents() {
        return Utils.getChildComponents(
          this.cqPath,
          this.cqItems,
          this.cqItemsOrder,
          (itemKey: string) => {},
          this.isInEditor,
          true,
          this.componentMapping
        );
      },
    },
  });
</script>

<style>
  @import 'SpaRoot.css';
  @import 'Page.css';
</style>
