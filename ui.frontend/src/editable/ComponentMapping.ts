import { ComponentMapping } from '@adobe/aem-spa-component-mapping';
import { Component, h } from 'vue';
import CompositeModelProvider from '@/editable/CompositeModelProvider.vue';
import CompositeEditableComponent from '@/editable/CompositeEditableComponent.vue';

interface ReloadForceAble {
  /*
   * Should the model cache be ignored when processing the component.
   */
  cqForceReload?: boolean;
}

interface MappedComponentProperties extends ReloadForceAble {
  isInEditor?: boolean;
  cqPath: string;
  appliedCssClassNames?: string;
  aemNoDecoration?: boolean;
}

interface EditConfig<P extends MappedComponentProperties> {
  emptyLabel?: string;
  resourceType?: string;

  isEmpty(props: P): boolean;
}

interface ReloadableModelProperties {
  forceReload?: boolean;
  injectPropsOnInit?: boolean;
}

const wrappedMapFunction = ComponentMapping.map;

const wrappedGetFunction = ComponentMapping.get;

const withMappable = <P extends MappedComponentProperties>(
  component: Component<P>,
  editConfig: EditConfig<P>,
  config?: ReloadableModelProperties
) => {
  const {
    injectPropsOnInit = true,
    forceReload = false,
    ...rest
  } = config || {};
  const configToUse: ReloadableModelProperties = {
    injectPropsOnInit,
    forceReload,
    ...rest,
  };

  let innerComponent = h(CompositeEditableComponent, {
    wrappedComponent: component,
    editConfig,
  });
  innerComponent = h(CompositeModelProvider, {
    wrappedComponent: innerComponent,
    modelConfig: configToUse,
  });

  return innerComponent;
};

ComponentMapping.map = function map<P extends MappedComponentProperties>(
  resourceTypes: string | string[],
  component: Component<P>,
  editConfig: EditConfig<P> = {
    isEmpty: (props: P) => false,
  },
  config: ReloadableModelProperties = {}
) {
  const { injectPropsOnInit = false, ...rest } = config || {};
  const innerComponent = withMappable(component, editConfig, {
    injectPropsOnInit,
    ...rest,
  });

  wrappedMapFunction.call(ComponentMapping, resourceTypes, innerComponent);

  return innerComponent;
};

ComponentMapping.get = wrappedGetFunction;

const MapTo =
  <P extends MappedComponentProperties>(resourceTypes: string | string[]) =>
  (clazz: Component<P>, config?: EditConfig<P>) =>
    // @ts-ignore
    ComponentMapping.map(resourceTypes, clazz, config);

export { ComponentMapping, MapTo, withMappable };
