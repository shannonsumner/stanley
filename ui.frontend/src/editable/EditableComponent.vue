<template>
  <template v-if="disabledWcmMode">
    <component :is="wrappedComponent" v-bind="wrappedComponentProps" />
  </template>
  <div v-else :class="className" v-bind="{ ...editProps, ...containerProps }">
    <component :is="wrappedComponent" v-bind="wrappedComponentProps" />
    <div v-bind="emptyPlaceholderProps" />
  </div>
</template>

<script lang="ts">
  import { Component, defineComponent, PropType, VNode } from 'vue';
  import Utils from '@/utils/Utils';
  import classNames from 'classnames';

  interface ReloadForceAble {
    /*
     * Should the model cache be ignored when processing the component.
     */
    cqForceReload?: boolean;
  }

  interface MappedComponentProperties extends ReloadForceAble {
    id?: string;
    isInEditor: boolean;
    cqPath: string;
    cqType: string;
    appliedCssClassNames?: string;
    aemNoDecoration?: boolean;
    cqHierarchyType?: string;
  }

  interface EditConfig<P extends MappedComponentProperties> {
    emptyLabel?: string;
    resourceType?: string;

    isEmpty(props: P): boolean;
  }

  export default defineComponent({
    name: 'EditableComponent',
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
      componentProperties: {
        type: Object as PropType<MappedComponentProperties>,
        default: () => {},
      },
      containerProps: {
        type: Object as PropType<{ [key: string]: string }>,
        default: () => {},
      },
      cqForceReload: {
        type: Boolean,
        default: false,
      },
      cqPath: {
        type: String,
        default: '',
      },
      cqType: {
        type: String,
        default: '',
      },
      editConfig: {
        type: Object as PropType<EditConfig<MappedComponentProperties>>,
        default: () => ({ isEmpty: (props: any) => false }),
      },
      id: {
        type: String,
        default: null,
      },
      isInEditor: {
        type: Boolean,
        default: Utils.isInEditor(),
      },
      wrappedComponent: {
        type: Object as PropType<Component | VNode>,
        default: () => {},
      },
    },
    setup(props, context) {
      // console.log('EditableComponent properties: ', props);
      // console.log('EditableComponent attributes: ', context.attrs);
    },
    computed: {
      editProps() {
        const editProps: { [key: string]: string } = {};

        if (!this.componentProperties.isInEditor) {
          return editProps;
        }

        editProps['data-cq-data-path'] = this.componentProperties.cqPath;

        if (this.editConfig.resourceType) {
          editProps['data-cq-resource-type'] = this.editConfig.resourceType;
        }
        return editProps;
      },

      className() {
        const { appliedCssClassNames } = this.componentProperties;

        const appliedCssClassNamesAsArray = (appliedCssClassNames || '').split(
          ' '
        );

        let containerCssClassNamesAsArray: string[] = [];

        if (this.containerProps?.className) {
          const containerCssClassNames = this.containerProps.className;
          containerCssClassNamesAsArray = containerCssClassNames.split(' ');
        }

        return classNames([
          ...appliedCssClassNamesAsArray,
          ...containerCssClassNamesAsArray,
        ]);
      },

      disabledWcmMode() {
        return (
          !this.componentProperties.isInEditor &&
          this.componentProperties.aemNoDecoration
        );
      },

      emptyPlaceholderProps() {
        if (
          this.componentProperties.isInEditor &&
          typeof this.editConfig.isEmpty === 'function' &&
          this.editConfig.isEmpty(this.componentProperties)
        ) {
          return {
            class: 'cq-placeholder',
            'data-emptytext': this.editConfig.emptyLabel,
          };
        }
        return {};
      },

      wrappedComponentProps() {
        return {
          aemNoDecoration: this.aemNoDecoration,
          appliedCssClassNames: this.appliedCssClassNames,
          componentProperties: this.componentProperties,
          cqForceReload: this.cqForceReload,
          cqPath: this.cqPath,
          cqType: this.cqType,
          id: this.id,
          isInEditor: this.isInEditor,
          ...this.$attrs,
        };
      },
    },
  });
</script>
