<template>
  <div>
    <router-view></router-view>
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
  import { defineComponent, nextTick, PropType, watchEffect } from 'vue';
  import { Model } from '@adobe/aem-spa-page-model-manager';
  import { ComponentMapping, Utils } from 'aem-vue-editable-components';
  import { useRouter } from 'vue-router';

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
      const router = useRouter();
      const childPages = Utils.getChildPages(
        props.cqChildren,
        props.componentMapping
      );

      watchEffect(async () => {
        await nextTick();
        const routes: string[] = [];
        router.getRoutes().forEach((route) => {
          routes.push(route.path);
        });
        if (routes.includes(props.locationPathname)) {
          await router.replace(props.locationPathname);
        } else if (childPages.length > 0) {
          await router.replace('/404');
        }
      });
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
      childPages() {
        return Utils.getChildPages(this.cqChildren, this.componentMapping);
      },
    },
  });
</script>

<style>
  @import 'SpaRoot.css';
  @import 'Page.css';
</style>
