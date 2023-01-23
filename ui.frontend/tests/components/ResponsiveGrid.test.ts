import { defineComponent } from 'vue';
import { ComponentMapping } from '@adobe/aem-spa-component-mapping';
import { mount } from '@vue/test-utils';
import ResponsiveGrid from '@/components/ResponsiveGrid.vue';

describe('ResponsiveGrid ->', () => {
  const CONTAINER_PLACEHOLDER_SELECTOR = '.new.section';
  const CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR =
    '[data-cq-data-path="/container/*"]';
  const ITEM_CLASS_NAME = 'item-class';
  const CONTAINER_PATH = '/container';
  const ITEM1_DATA_ATTRIBUTE_SELECTOR =
    '[data-cq-data-path="/container/component1"]';
  const ITEM2_DATA_ATTRIBUTE_SELECTOR =
    '[data-cq-data-path="/container/component2"]';
  const GRID_CLASS_NAMES = 'grid-class-names';
  const COLUMN_1_CLASS_NAMES = 'column-class-names-1';
  const COLUMN_2_CLASS_NAMES = 'column-class-names-2';
  const PLACEHOLDER_CLASS_NAMES = 'aem-Grid-newComponent';
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

  const COLUMN_CLASS_NAMES = {
    component1: COLUMN_1_CLASS_NAMES,
    component2: COLUMN_2_CLASS_NAMES,
  };

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

  const allowedComp = {
    applicable: false,
    components: [],
  };

  const STANDARD_GRID_PROPS = {
    cqPath: '',
    cqType: '',
    gridClassNames: '',
    columnClassNames: {},
    allowedComponents: allowedComp,
    title: '',
    cqItems: {},
    cqItemsOrder: [],
    isInEditor: false,
  };

  let ComponentMappingSpy: jest.SpyInstance;

  beforeEach(() => {
    ComponentMappingSpy = jest.spyOn(ComponentMapping, 'get');
  });

  afterEach(() => {
    ComponentMappingSpy.mockRestore();
  });

  describe('Grid class names ->', () => {
    it('should not have the grid class names', () => {
      const wrapper = mount(ResponsiveGrid, {
        propsData: {
          ...STANDARD_GRID_PROPS,
        },
      });
      const gridElement = wrapper.find(`.${GRID_CLASS_NAMES}`);
      expect(gridElement.exists()).toBeFalsy();
    });
  });

  describe('Placeholder ->', () => {
    it('should add the expected placeholder class names', () => {
      // @ts-ignore
      const wrapper = mount(ResponsiveGrid, {
        propsData: {
          ...STANDARD_GRID_PROPS,
          isInEditor: true,
          cqPath: CONTAINER_PATH,
        },
      });

      const gridPlaceholder = wrapper.find(
        `.${PLACEHOLDER_CLASS_NAMES}${CONTAINER_PLACEHOLDER_SELECTOR}${CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR}`
      );
      expect(gridPlaceholder.exists()).toBeTruthy();
    });
  });

  describe('Column class names ->', () => {
    it('should add the expected column class names', () => {
      ComponentMappingSpy.mockReturnValue(ChildComponent);

      // @ts-ignore
      const wrapper = mount(ResponsiveGrid, {
        propsData: {
          ...STANDARD_GRID_PROPS,
          isInEditor: true,
          columnClassNames: COLUMN_CLASS_NAMES,
          cqPath: CONTAINER_PATH,
          cqItems: ITEMS,
          cqItemsOrder: ITEMS_ORDER,
        },
      });

      const childItem1 = wrapper.find(
        `.${COLUMN_1_CLASS_NAMES}${ITEM1_DATA_ATTRIBUTE_SELECTOR}`
      );
      const childItem2 = wrapper.find(
        `.${COLUMN_2_CLASS_NAMES}${ITEM2_DATA_ATTRIBUTE_SELECTOR}`
      );

      expect(childItem1.exists()).toBeFalsy();
      expect(childItem2.exists()).toBeFalsy();
    });
  });
});
