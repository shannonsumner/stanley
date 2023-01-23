import { Component, defineComponent } from 'vue';
import { ComponentMapping, MapTo } from '@/editable/ComponentMapping';

describe('ComponentMapping', () => {
  const COMPONENT_RESOURCE_TYPE = 'test/component/resource/type';
  const editConfig = {
    emptyLabel: 'Image',

    isEmpty(props: any) {
      return !props || !props.src || props.src.trim().length < 1;
    },
  };

  const TestComponent = defineComponent({
    name: 'TestComponent',
    template: '<div />',
  });

  it('should store and retrieve component', () => {
    const mockElement = document.createElement('meta');
    mockElement.setAttribute('content', 'edit');
    const spy = jest
      .spyOn(document.head, 'querySelector')
      .mockReturnValue(mockElement as HTMLElement);

    const WrappedReturnType = MapTo(COMPONENT_RESOURCE_TYPE)(
      TestComponent as Component,
      editConfig
    );

    const WrappedComponentFromGet = ComponentMapping.get(
      COMPONENT_RESOURCE_TYPE
    );

    expect(WrappedComponentFromGet).toBeDefined();
    expect(WrappedReturnType).toBeDefined();

    expect(WrappedReturnType).toBe(WrappedComponentFromGet);

    spy.mockRestore();
  });
});
