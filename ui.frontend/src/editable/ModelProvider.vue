<template>
  <component :is="wrappedComponent" :key="updateTime" v-bind="computedProps" />
</template>

<script lang="ts">
  /* eslint-disable vue/no-setup-props-destructure,prefer-const */
  import { Component, defineComponent, PropType, VNode } from 'vue';
  import Utils from '@/utils/Utils';
  import { ModelManager, PathUtils } from '@adobe/aem-spa-page-model-manager';

  export default defineComponent({
    name: 'ModelProvider',
    inheritAttrs: false,
    props: {
      cqForceReload: {
        type: Boolean,
        default: false,
      },
      cqPath: {
        type: String,
        default: '',
      },
      injectPropsOnInit: {
        type: Boolean,
        default: false,
      },
      isInEditor: {
        type: Boolean,
        default: Utils.isInEditor(),
      },
      itemPath: {
        type: String,
        default: '',
      },
      pagePath: {
        type: String,
        default: '',
      },
      wrappedComponent: {
        type: Object as PropType<Component | VNode>,
        default: () => {},
      },
    },
    setup(props, context) {
      // console.log('ModelProvider properties: ', props);
      // console.log('ModelProvider attributes: ', context.attrs);
    },
    data() {
      return {
        updatedProps: {},
        updateTime: new Date().getTime(),
      };
    },
    computed: {
      computedProps() {
        return {
          ...this.$attrs,
          pagePath: this.pagePath,
          itemPath: this.itemPath,
          cqPath: Utils.getCQPath({
            pagePath: this.pagePath,
            itemPath: this.itemPath,
            injectPropsOnInit: this.injectPropsOnInit,
            cqPath: this.cqPath,
          }),
          ...this.updatedProps,
        };
      },
      updatedCqPath() {
        const {
          pagePath,
          itemPath,
          injectPropsOnInit,
          cqPath,
        }: {
          pagePath: string;
          itemPath: string;
          injectPropsOnInit: boolean;
          cqPath: string;
        } = this;
        return Utils.getCQPath({
          pagePath,
          itemPath,
          injectPropsOnInit,
          cqPath,
        });
      },
    },
    mounted() {
      if (this.injectPropsOnInit) {
        this.updateData(this.updatedCqPath);
      }
      ModelManager.addListener(this.updatedCqPath, this.updateDataListener);
    },
    unmounted() {
      ModelManager.removeListener(this.updatedCqPath, this.updateDataListener);
    },
    methods: {
      async updateData(cqPath: string) {
        const {
          pagePath,
          itemPath,
          injectPropsOnInit,
        }: {
          pagePath: string;
          itemPath: string;
          injectPropsOnInit: boolean;
        } = this;

        const path =
          cqPath ||
          this.cqPath ||
          (this.pagePath &&
            Utils.getCQPath({ pagePath, itemPath, injectPropsOnInit }));

        if (path) {
          const data = await ModelManager.getData({
            path,
            forceReload: this.cqForceReload,
          });
          if (data && Object.keys(data).length > 0) {
            Object.assign(this.updatedProps, Utils.modelToProps(data));
            this.updateTime = new Date().getTime();

            // Fire event once component model has been fetched and rendered to enable editing on AEM
            if (injectPropsOnInit && Utils.isInEditor()) {
              PathUtils.dispatchGlobalCustomEvent(
                'cq-async-content-loaded',
                {}
              );
            }
          }
        }
      },
      updateDataListener() {
        this.updateData(this.updatedCqPath);
      },
    },
  });
</script>
