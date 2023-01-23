import { defineComponent, h, markRaw } from 'vue';
import { mount } from '@vue/test-utils';
import { AuthoringUtils } from '@adobe/aem-spa-page-model-manager';
import Page from '@/components/Page.vue';
import { ComponentMapping } from '@/editable/ComponentMapping';
import CompositeEditableComponent from '@/editable/CompositeEditableComponent.vue';

describe('Page ->', () => {
  const CHILD_COMPONENT_CLASS_NAME = 'child-class';
  const PAGE_PATH = '/page';
  const ITEM1_DATA_ATTRIBUTE_SELECTOR =
    '[data-cq-data-path="/page/jcr:content/component1"]';
  const ITEM2_DATA_ATTRIBUTE_SELECTOR =
    '[data-cq-data-path="/page/jcr:content/component2"]';
  const CHILD_PAGE_1_DATA_ATTRIBUTE_SELECTOR =
    '[data-cq-data-path="child/page1"]';
  const CHILD_PAGE_2_DATA_ATTRIBUTE_SELECTOR =
    '[data-cq-data-path="child/page2"]';
  const COMPONENT_TYPE1 = 'components/c1';
  const COMPONENT_TYPE2 = 'components/c2';
  const PAGE_TYPE1 = 'components/p1';
  const PAGE_TYPE2 = 'components/p2';

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

  const CHILDREN = {
    page1: {
      cqChildren: {},
      cqItems: {},
      cqItemsOrder: [],
      cqPath: '',
      cqType: '',
      isInEditor: true,
      ':type': PAGE_TYPE1,
      id: 'p1',
      ':path': 'child/page1',
    },
    page2: {
      cqChildren: {},
      cqItems: {},
      cqItemsOrder: [],
      cqPath: '',
      cqType: '',
      isInEditor: true,
      ':type': PAGE_TYPE2,
      id: 'p2',
      ':path': 'child/page2',
    },
  };

  let ComponentMappingSpy: any;
  let EditorContextPage: any;

  interface DummyProps {
    id: string;
  }

  const ChildComponent = defineComponent({
    name: 'ChildComponent',
    inheritAttrs: false,
    props: {
      id: {
        type: String,
        default: null,
      },
    },
    setup() {
      return { classNameProperty: CHILD_COMPONENT_CLASS_NAME };
    },
    template: `
      <div :id="id" :class="classNameProperty" />`,
  });

  beforeEach(() => {
    ComponentMappingSpy = jest.spyOn(ComponentMapping, 'get');
    EditorContextPage = Page;
    jest.spyOn(AuthoringUtils, 'isInEditor').mockReturnValue(true);
  });

  afterEach(() => {
    ComponentMappingSpy.mockRestore();
  });

  describe('Page ->', () => {
    it('should render the page component with only required parameters', () => {
      // @ts-ignore
      const wrapper = mount(Page, {
        propsData: {
          cqItems: {},
          cqItemsOrder: [],
        },
      });
      const { element } = wrapper;
      expect(element.classList.contains('aem-page')).toBeTruthy();
    });

    it('should render the page component with additional classes', () => {
      const EXTRA_CLASS_NAMES = 'test-class-names';
      // @ts-ignore
      const wrapper = mount(Page, {
        propsData: {
          cqItems: {},
          cqItemsOrder: [],
          cssClassNames: EXTRA_CLASS_NAMES,
        },
      });
      const { element } = wrapper;
      expect(element.classList.contains(EXTRA_CLASS_NAMES)).toBeTruthy();
    });
  });

  describe('child pages ->', () => {
    it('should add the expected children', () => {
      ComponentMappingSpy.mockReturnValue(ChildComponent);

      // @ts-ignore
      const wrapper = mount(Page, {
        propsData: {
          componentMapping: new ComponentMapping(),
          cqPath: PAGE_PATH,
          cqChildren: CHILDREN,
          cqItems: ITEMS,
          cqItemsOrder: ITEMS_ORDER,
          isInEditor: false,
        },
      });

      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);

      const childItem1 = wrapper.find('#c1');
      const childItem2 = wrapper.find('#c2');

      expect(childItem1.exists()).toBeTruthy();
      expect(childItem2.exists()).toBeTruthy();

      const childPage1 = wrapper.find('#p1');
      const childPage2 = wrapper.find('#p2');

      expect(childPage1.exists()).toBeTruthy();
      expect(childPage2.exists()).toBeTruthy();
    });

    it('should add the expected children with data attributes when in WCM edit mode', () => {
      const EditableChildComponent = h(CompositeEditableComponent, {
        wrappedComponent: markRaw(ChildComponent),
      });

      ComponentMappingSpy.mockImplementation((key: string) => {
        switch (key) {
          case COMPONENT_TYPE1:
          case COMPONENT_TYPE2:
            return EditableChildComponent;

          case PAGE_TYPE1:
          case PAGE_TYPE2:
            return EditorContextPage;

          default:
            return null;
        }
      });

      // @ts-ignore
      const wrapper = mount(Page, {
        propsData: {
          isInEditor: true,
          cqPath: PAGE_PATH,
          cqChildren: CHILDREN,
          cqItems: ITEMS,
          cqItemsOrder: ITEMS_ORDER,
        },
      });

      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);

      const childItem1 = wrapper.find(ITEM1_DATA_ATTRIBUTE_SELECTOR);
      const childItem2 = wrapper.find(ITEM2_DATA_ATTRIBUTE_SELECTOR);

      expect(childItem1.exists()).toBeTruthy();
      expect(childItem2.exists()).toBeTruthy();

      const childPage1 = wrapper.find(CHILD_PAGE_1_DATA_ATTRIBUTE_SELECTOR);
      const childPage2 = wrapper.find(CHILD_PAGE_2_DATA_ATTRIBUTE_SELECTOR);

      expect(childPage1.exists()).toBeTruthy();
      expect(childPage2.exists()).toBeTruthy();
    });
  });
});
