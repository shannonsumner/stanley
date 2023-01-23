import { defineComponent, h, markRaw } from 'vue';
import { ComponentMapping } from '@/editable/ComponentMapping';
import { mount } from '@vue/test-utils';
import CompositeEditableComponent from '@/editable/CompositeEditableComponent.vue';
import Container from '@/components/Container.vue';

describe('Container ->', () => {
  const CONTAINER_PLACEHOLDER_SELECTOR = '.new.section';
  const CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR =
    '[data-cq-data-path="/container/*"]';
  const ITEM_CLASS_NAME = 'item-class';
  const CONTAINER_PATH = '/container';
  const ITEM1_DATA_ATTRIBUTE_SELECTOR =
    '[data-cq-data-path="/container/component1"]';
  const ITEM2_DATA_ATTRIBUTE_SELECTOR =
    '[data-cq-data-path="/container/component2"]';
  const COMPONENT_TYPE1 = 'components/c1';
  const COMPONENT_TYPE2 = 'components/c2';

  const ITEMS = {
    component1: {
      ':type': COMPONENT_TYPE1,
      id: 'c1',
    },
    component2: {
      ':type': COMPONENT_TYPE2,
      id: 'c2',
    },
  };

  const ITEMS_ORDER = ['component1', 'component2'];

  const ChildComponent = defineComponent({
    name: 'ChildComponent',
    props: {
      id: {
        type: String,
        default: null,
      },
    },
    setup(props) {
      const classNamesAsArray = [ITEM_CLASS_NAME];
      return { classNameProperty: classNamesAsArray.join(' ') };
    },
    template: `
      <div :id="id" :class="classNameProperty" />`,
  });

  let ComponentMappingSpy: jest.SpyInstance;

  beforeEach(() => {
    ComponentMappingSpy = jest.spyOn(ComponentMapping, 'get');
  });

  afterEach(() => {
    ComponentMappingSpy.mockRestore();
  });

  describe('childComponents ->', () => {
    it('should add the expected components', () => {
      ComponentMappingSpy.mockReturnValue(ChildComponent);

      // @ts-ignore
      const wrapper = mount(Container, {
        propsData: {
          componentMapping: new ComponentMapping(),
          cqItems: ITEMS,
          cqItemsOrder: ITEMS_ORDER,
          cqPath: '',
          isInEditor: false,
        },
      });

      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);

      const childItem1 = wrapper.find('#c1');
      const childItem2 = wrapper.find('#c2');

      expect(childItem1.exists()).toBeTruthy();
      expect(childItem2.exists()).toBeTruthy();
    });

    it('should add a placeholder with data attribute when in WCM edit mode', () => {
      // @ts-ignore
      const wrapper = mount(Container, {
        propsData: {
          componentMapping: new ComponentMapping(),
          cqPath: CONTAINER_PATH,
          isInEditor: true,
          cqItems: {},
          cqItemsOrder: [],
        },
      });
      const containerPlaceholder = wrapper.find(
        CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR +
          CONTAINER_PLACEHOLDER_SELECTOR
      );
      expect(containerPlaceholder.exists()).toBeTruthy();
    });

    it('should not add a placeholder when not in WCM edit mode', () => {
      // @ts-ignore
      const wrapper = mount(Container, {
        propsData: {
          componentMapping: new ComponentMapping(),
          isInEditor: false,
          cqItems: {},
          cqItemsOrder: [],
        },
      });
      const containerPlaceholder = wrapper.find(CONTAINER_PLACEHOLDER_SELECTOR);
      expect(containerPlaceholder.exists()).toBeFalsy();
    });

    it('should add a data attribute on the children when in WCM edit mode', () => {
      const EditableChildComponent = h(CompositeEditableComponent, {
        wrappedComponent: markRaw(ChildComponent),
      });

      ComponentMappingSpy.mockReturnValue(EditableChildComponent);
      // @ts-ignore
      const wrapper = mount(Container, {
        propsData: {
          componentMapping: new ComponentMapping(),
          isInEditor: true,
          cqPath: CONTAINER_PATH,
          cqItems: ITEMS,
          cqItemsOrder: ITEMS_ORDER,
        },
      });
      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);
      const containerPlaceholder = wrapper.find(CONTAINER_PLACEHOLDER_SELECTOR);
      expect(containerPlaceholder.exists()).toBeTruthy();
      const childItem1 = wrapper.find(ITEM1_DATA_ATTRIBUTE_SELECTOR);
      const childItem2 = wrapper.find(ITEM2_DATA_ATTRIBUTE_SELECTOR);
      expect(childItem1.exists()).toBeTruthy();
      expect(childItem2.exists()).toBeTruthy();
    });
  });

  describe('Data attributes ->', () => {
    it('should not add a the cq-data-path attribute if not in WCM edit mode', () => {
      // @ts-ignore
      const wrapper = mount(Container, {
        propsData: {
          componentMapping: new ComponentMapping(),
          isInEditor: false,
          cqPath: CONTAINER_PATH,
          cqItems: {},
          cqItemsOrder: [],
        },
      });
      const container = wrapper.find('[data-cq-data-path="/container"]');
      expect(container.exists()).toBeFalsy();
    });

    it('should add a the cq-data-path attribute if in WCM edit mode', () => {
      // @ts-ignore
      const wrapper = mount(Container, {
        propsData: {
          componentMapping: new ComponentMapping(),
          isInEditor: true,
          cqPath: CONTAINER_PATH,
          cqItems: {},
          cqItemsOrder: [],
        },
      });
      const container = wrapper.find('[data-cq-data-path="/container"]');
      expect(container.exists()).toBeTruthy();
    });
  });

  describe('container decoration ->', () => {
    it('if aemNoDecoration is set to true, there should not be a container div wrapper', () => {
      // @ts-ignore
      const wrapper = mount(Container, {
        propsData: {
          componentMapping: new ComponentMapping(),
          isInEditor: false,
          cqPath: CONTAINER_PATH,
          aemNoDecoration: true,
          cqItems: {},
          cqItemsOrder: [],
        },
      });

      const container = wrapper.find('.aem-container');
      expect(container.exists()).toBeFalsy();
    });
  });
});
