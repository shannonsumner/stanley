<template>
  <EditableComponent v-bind="computedProps" />
</template>

<script lang="ts">
  import { Component, defineComponent, PropType, VNode } from 'vue';
  import EditableComponent from '@/editable/EditableComponent.vue';
  import Utils from '@/utils/Utils';

  export default defineComponent({
    name: 'CompositeEditableComponent',
    components: {
      EditableComponent,
    },
    inheritAttrs: false,
    props: {
      editConfig: {
        type: Object as PropType<Record<string, any>>,
        default: () => {},
      },
      wrappedComponent: {
        type: Object as PropType<Component | VNode>,
        default: () => {},
      },
    },
    setup(props, context) {
      // console.log('CompositeEditableComponent properties: ', props);
      // console.log('CompositeEditableComponent attributes: ', context.attrs);
    },
    computed: {
      computedProps() {
        const defaultEditConfig = this.editConfig || {
          isEmpty: () => false,
        };

        const isInEditor = this.$attrs?.isInEditor || Utils.isInEditor();
        const aemNoDecoration = this.$attrs?.aemNoDecoration || false;

        return {
          ...this.$attrs,
          componentProperties: {
            ...this.$attrs,
            isInEditor,
            aemNoDecoration,
          },
          editConfig: defaultEditConfig,
          wrappedComponent: this.wrappedComponent,
        };
      },
    },
  });
</script>
