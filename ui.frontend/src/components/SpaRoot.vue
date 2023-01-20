<template>
  <div>
    <router-view></router-view>
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
  import { ComponentMapping } from '@adobe/aem-spa-component-mapping';
  import Utils from '@/utils/Utils';
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
      locationPathname: {
        type: String,
        default: window.location.pathname,
      },
    },
    setup(props) {
      // console.log('SpaRoot properties: ', props);
      const router = useRouter();

      watchEffect(async () => {
        await nextTick();
        const routes: string[] = [];
        router.getRoutes().forEach((route) => {
          routes.push(route.path);
        });
        if (routes.includes(props.locationPathname)) {
          await router.replace(props.locationPathname);
        } else {
          await router.replace('/404');
        }
      });
    },
    computed: {
      childPages() {
        return Utils.getChildPages(this.cqChildren, this.componentMapping);
      },
    },
  });
</script>

<style>
  @import 'SpaRoot.css';
</style>
