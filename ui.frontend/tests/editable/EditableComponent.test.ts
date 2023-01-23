import { defineComponent, markRaw } from 'vue';
import Utils from '@/utils/Utils';
import classNames from 'classnames';
import { mount } from '@vue/test-utils';
import CompositeEditableComponent from '@/editable/CompositeEditableComponent.vue';

describe('EditableComponent ->', () => {
  const COMPONENT_RESOURCE_TYPE = '/component/resource/type';
  const COMPONENT_PATH = '/path/to/component';
  const CHILD_COMPONENT_APPLIED_STYLE_CLASS_NAME = 'my_custom_style';
  const CHILD_COMPONENT_CLASS_NAME = 'child-class';
  const DATA_PATH_ATTRIBUTE_SELECTOR = `[data-cq-data-path="${COMPONENT_PATH}"]`;
  const DATA_RESOURCE_TYPE_SELECTOR = `[data-cq-resource-type="${COMPONENT_RESOURCE_TYPE}"]`;
  const EMPTY_LABEL = 'Empty Label';
  const EMPTY_TEXT_SELECTOR = `[data-emptytext="${EMPTY_LABEL}"]`;
  const GRID_CLASS_NAME = 'aem-grid-column-x';
  const CQ_PROPS = {
    cqType: COMPONENT_RESOURCE_TYPE,
    cqPath: COMPONENT_PATH,
    appliedCssClassNames: CHILD_COMPONENT_APPLIED_STYLE_CLASS_NAME,
    containerProps: {
      class: GRID_CLASS_NAME,
    },
  };
  const IN_EDITOR_CLASS_NAME = 'in-editor-class';

  const ChildComponent = defineComponent({
    name: 'ChildComponent',
    inheritAttrs: false,
    props: {
      id: {
        type: String,
        default: null,
      },
      isInEditor: {
        type: Boolean,
        default: Utils.isInEditor(),
      },
    },
    computed: {
      className() {
        return classNames(CHILD_COMPONENT_CLASS_NAME, {
          [IN_EDITOR_CLASS_NAME]: this.isInEditor,
        });
      },
    },
    template: `
      <div :id="id" :class="className" />`,
  });

  let sandbox: jest.SpyInstance;
  const isInEditor = false;

  beforeEach(() => {
    sandbox = jest
      .spyOn(Utils, 'isInEditor')
      .mockImplementation(() => isInEditor);
  });

  afterEach(() => {
    sandbox.mockRestore();
  });

  describe('Provider/Consumer ->', () => {
    it('should propagate its value - true', () => {
      // @ts-ignore
      const wrapper = mount(CompositeEditableComponent, {
        propsData: {
          wrappedComponent: markRaw(ChildComponent),
          isInEditor: true,
        },
      });
      const childNode = wrapper.find(`.${IN_EDITOR_CLASS_NAME}`);
      expect(childNode.exists()).toBeTruthy();
    });

    it('should propagate its value - false', () => {
      // @ts-ignore
      const wrapper = mount(CompositeEditableComponent, {
        propsData: {
          wrappedComponent: markRaw(ChildComponent),
          isInEditor: false,
        },
      });
      const childNode = wrapper.find(`.${IN_EDITOR_CLASS_NAME}`);
      expect(childNode.exists()).toBeFalsy();
    });
  });

  describe('Component emptiness ->', () => {
    it('should declare the component to be empty', () => {
      const EDIT_CONFIG = {
        isEmpty() {
          return true;
        },
        emptyLabel: EMPTY_LABEL,
      };

      // @ts-ignore
      const wrapper = mount(CompositeEditableComponent, {
        propsData: {
          wrappedComponent: markRaw(ChildComponent),
          editConfig: EDIT_CONFIG,
          isInEditor: true,
          ...CQ_PROPS,
        },
      });

      const selector = `${DATA_PATH_ATTRIBUTE_SELECTOR} .${CHILD_COMPONENT_CLASS_NAME} + .cq-placeholder${EMPTY_TEXT_SELECTOR}`;
      const node = wrapper.find(selector);
      expect(node.exists()).toBeTruthy();
    });

    it('should declare the component to be empty without providing a label', () => {
      const EDIT_CONFIG = {
        isEmpty() {
          return true;
        },
      };

      // @ts-ignore
      const wrapper = mount(CompositeEditableComponent, {
        propsData: {
          wrappedComponent: markRaw(ChildComponent),
          editConfig: EDIT_CONFIG,
          isInEditor: true,
          ...CQ_PROPS,
        },
      });

      let node = wrapper.find(
        // eslint-disable-next-line no-underscore-dangle
        `${DATA_PATH_ATTRIBUTE_SELECTOR} .cq-placeholder${EMPTY_TEXT_SELECTOR}`
      );
      expect(node.exists()).toBeFalsy();
      node = wrapper.find(
        // eslint-disable-next-line no-underscore-dangle
        `${DATA_PATH_ATTRIBUTE_SELECTOR} .${CHILD_COMPONENT_CLASS_NAME} + .cq-placeholder`
      );
      expect(node.exists()).toBeTruthy();
    });

    it('should declare the component as not being in the editor', () => {
      const EDIT_CONFIG = {
        isEmpty() {
          return true;
        },
      };

      // @ts-ignore
      const wrapper = mount(CompositeEditableComponent, {
        propsData: {
          wrappedComponent: markRaw(ChildComponent),
          editConfig: EDIT_CONFIG,
          isInEditor: false,
          ...CQ_PROPS,
        },
      });

      let node = wrapper.find(`.cq-placeholder${EMPTY_TEXT_SELECTOR}`);
      expect(node.exists()).toBeFalsy();
      node = wrapper.find(
        `${DATA_PATH_ATTRIBUTE_SELECTOR} .${CHILD_COMPONENT_CLASS_NAME} + .cq-placeholder`
      );
      expect(node.exists()).toBeFalsy();
    });

    it('should declare the component not to be empty', () => {
      const EDIT_CONFIG = {
        isEmpty() {
          return false;
        },
        emptyLabel: EMPTY_LABEL,
      };

      // @ts-ignore
      const wrapper = mount(CompositeEditableComponent, {
        propsData: {
          wrappedComponent: markRaw(ChildComponent),
          editConfig: EDIT_CONFIG,
          isInEditor: true,
          ...CQ_PROPS,
        },
      });
      let node = wrapper.find(
        // eslint-disable-next-line no-underscore-dangle
        `.${CHILD_COMPONENT_CLASS_NAME} + .cq-placeholder`
      );
      expect(node.exists()).toBeFalsy();
      node = wrapper.find(
        `${DATA_PATH_ATTRIBUTE_SELECTOR} .${CHILD_COMPONENT_CLASS_NAME}`
      );
      expect(node.exists()).toBeTruthy();
    });
  });

  describe('resouceType attribute ->', () => {
    it('should have the data-cq-resource-type attribute set when passing this via the Editconfig', () => {
      const EDIT_CONFIG = {
        isEmpty() {
          return false;
        },
        emptyLabel: EMPTY_LABEL,
        resourceType: COMPONENT_RESOURCE_TYPE,
      };
      // @ts-ignore
      const wrapper = mount(CompositeEditableComponent, {
        propsData: {
          wrappedComponent: markRaw(ChildComponent),
          editConfig: EDIT_CONFIG,
          isInEditor: true,
          ...CQ_PROPS,
        },
      });
      const node = wrapper.find(DATA_RESOURCE_TYPE_SELECTOR);
      expect(node.exists()).toBeTruthy();
    });

    it('should NOT have the data-cq-resource-type attribute set when NOT passing it via the Editconfig', () => {
      const EDIT_CONFIG = {
        isEmpty() {
          return false;
        },
        emptyLabel: EMPTY_LABEL,
      };

      // @ts-ignore
      const wrapper = mount(CompositeEditableComponent, {
        propsData: {
          wrappedComponent: markRaw(ChildComponent),
          editConfig: EDIT_CONFIG,
          isInEditor: true,
          ...CQ_PROPS,
        },
      });

      const node = wrapper.find(DATA_RESOURCE_TYPE_SELECTOR);
      expect(node.exists()).toBeFalsy();
    });
  });

  describe('resouceType attribute ->', () => {
    it('should have the class attribute containing appliedCssClasses value appended/set to pre-existing class if any set', () => {
      const EDIT_CONFIG = {
        isEmpty() {
          return false;
        },
        emptyLabel: EMPTY_LABEL,
        resourceType: COMPONENT_RESOURCE_TYPE,
      };
      // @ts-ignore
      const wrapper = mount(CompositeEditableComponent, {
        propsData: {
          wrappedComponent: markRaw(ChildComponent),
          editConfig: EDIT_CONFIG,
          isInEditor: true,
          ...CQ_PROPS,
        },
      });
      const node = wrapper.find(
        `${DATA_PATH_ATTRIBUTE_SELECTOR}.${CQ_PROPS.appliedCssClassNames}`
      );
      expect(node.exists()).toBeTruthy();
    });

    it('should not have any custom CSS classes if appliedCssClasses is empty or not set', () => {
      const EDIT_CONFIG = {
        isEmpty() {
          return false;
        },
        emptyLabel: EMPTY_LABEL,
        resourceType: COMPONENT_RESOURCE_TYPE,
      };
      const { appliedCssClassNames, ...otherCQProps } = CQ_PROPS;
      // @ts-ignore
      const wrapper = mount(CompositeEditableComponent, {
        propsData: {
          wrappedComponent: markRaw(ChildComponent),
          editConfig: EDIT_CONFIG,
          isInEditor: true,
          ...otherCQProps,
        },
      });
      const node = wrapper.find(
        `${DATA_PATH_ATTRIBUTE_SELECTOR}.${appliedCssClassNames}`
      );
      expect(node.exists()).toBeFalsy();
    });

    it('if aem grid column styles set, appliedCssClassNames should not override the grid styles', () => {
      const EDIT_CONFIG = {
        isEmpty() {
          return false;
        },
        emptyLabel: EMPTY_LABEL,
        resourceType: COMPONENT_RESOURCE_TYPE,
      };
      // @ts-ignore
      const wrapper = mount(CompositeEditableComponent, {
        propsData: {
          wrappedComponent: markRaw(ChildComponent),
          editConfig: EDIT_CONFIG,
          isInEditor: true,
          ...CQ_PROPS,
        },
      });
      const node = wrapper.find(`.${GRID_CLASS_NAME}`);

      expect(node.exists()).toBeTruthy();
    });

    describe('component decoration ->', () => {
      it('if aemNoDecoration is set to true, there should not be a component div wrapper', () => {
        const EDIT_CONFIG = {
          isEmpty() {
            return false;
          },
          emptyLabel: EMPTY_LABEL,
          resourceType: COMPONENT_RESOURCE_TYPE,
        };

        // @ts-ignore
        const wrapper = mount(CompositeEditableComponent, {
          propsData: {
            wrappedComponent: markRaw(ChildComponent),
            editConfig: EDIT_CONFIG,
            isInEditor: false,
            aemNoDecoration: true,
            ...CQ_PROPS,
          },
        });
        const node = wrapper.find(`.${CQ_PROPS.appliedCssClassNames}`);

        expect(node.exists()).toBeFalsy();
      });
    });
  });
});
