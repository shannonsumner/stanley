<template>
  <AllowedComponentPlaceholderList
    v-if="showAllowedComponentPlaceholderList"
    :components="allowedComponents.components"
    :cq-path="cqPath"
    :empty-label="emptyLabel"
    :placeholder-props="placeholderProps"
    :title="title"
  />
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
  import { ComponentMapping } from '@adobe/aem-spa-component-mapping';
  import { Model } from '@adobe/aem-spa-page-model-manager';
  import Utils from '@/utils/Utils';
  import AllowedComponentPlaceholderList from '@/components/AllowedComponentPlaceholderList.vue';
  import ContainerPlaceholder from '@/components/ContainerPlaceholder.vue';
  import classNames from 'classnames';

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
    name: 'AllowedComponentsContainer',
    components: {
      AllowedComponentPlaceholderList,
      ContainerPlaceholder,
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
      isInEditor: {
        type: Boolean,
        default: Utils.isInEditor(),
      },
      title: {
        type: String,
        default: 'Layout Container',
      },
    },
    computed: {
      showAllowedComponentPlaceholderList() {
        return (
          this.isInEditor &&
          this.allowedComponents &&
          this.allowedComponents.applicable &&
          // eslint-disable-next-line no-underscore-dangle
          this._allowedComponentPlaceholderListEmptyLabel
        );
      },
      emptyLabel() {
        return (
          // eslint-disable-next-line no-underscore-dangle
          (this._allowedComponentPlaceholderListEmptyLabel as string) ||
          'No allowed components'
        );
      },
      childComponents() {
        const containerProps = (itemKey: string) => {
          let className = '';
          if (this.columnClassNames && this.columnClassNames[itemKey]) {
            className = this.columnClassNames[itemKey];
          }

          return {
            class: className,
          };
        };
        return Utils.getChildComponents(
          this.cqPath,
          this.cqItems,
          this.cqItemsOrder,
          containerProps,
          this.isInEditor,
          false,
          this.componentMapping
        );
      },
      containerProps() {
        const containerProps: { [key: string]: string } = {
          class: classNames('aem-container', this.gridClassNames),
        };

        if (this.isInEditor) {
          containerProps['data-cq-data-path'] = this.cqPath;
        }

        return containerProps;
      },
      placeholderProps() {
        return {
          cqPath: this.cqPath,
          placeholderClassNames: classNames(
            'new',
            'section',
            'aem-Grid-newComponent'
          ),
        };
      },
      disabledWcmMode() {
        return !this.isInEditor && this.aemNoDecoration;
      },
    },
  });
</script>
