<template>
  <template v-if="disabledWcmMode">
    <component
      :is="childComponent"
      v-for="childComponent of childComponents"
      :key="childComponent.toString()"
    />
  </template>
  <div v-else v-bind="containerProps">
    <component
      :is="childComponent"
      v-for="childComponent of childComponents"
      :key="childComponent.toString()"
    />
    <ContainerPlaceholder v-if="isInEditor" v-bind="placeholderProps" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { Model } from '@adobe/aem-spa-page-model-manager';
  import { ComponentMapping } from '@adobe/aem-spa-component-mapping';
  import classNames from 'classnames';
  import Utils from '@/utils/Utils';
  import ContainerPlaceholder from '@/components/ContainerPlaceholder.vue';

  interface PageModel extends Model {
    ':type': string;
    id: string;
    ':path': string;
    ':children'?: { [key: string]: PageModel };
  }

  export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Container',
    components: {
      ContainerPlaceholder,
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
      isInEditor: {
        type: Boolean,
        default: Utils.isInEditor(),
      },
    },
    computed: {
      childComponents() {
        return Utils.getChildComponents(
          this.cqPath,
          this.cqItems,
          this.cqItemsOrder,
          (itemKey) => {},
          this.isInEditor,
          false,
          this.componentMapping
        );
      },
      containerProps() {
        const containerProps: { [key: string]: string } = {
          class: classNames('aem-container'),
        };

        if (this.isInEditor) {
          containerProps['data-cq-data-path'] = this.cqPath;
        }

        return containerProps;
      },
      placeholderProps() {
        return {
          cqPath: this.cqPath,
          placeholderClassNames: 'new section',
        };
      },
      disabledWcmMode() {
        return !this.isInEditor && this.aemNoDecoration;
      },
    },
  });
</script>
