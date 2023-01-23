/* eslint-disable import/no-extraneous-dependencies */
import { defineComponent, markRaw } from 'vue';
import { ModelManager, PathUtils } from '@adobe/aem-spa-page-model-manager';
import ModelProvider from '@/editable/ModelProvider.vue';
import { mount } from '@vue/test-utils';
import { waitFor } from '@testing-library/vue';
import CompositeModelProvider from '@/editable/CompositeModelProvider.vue';
import Utils from '@/utils/Utils';

describe('ModelProvider ->', () => {
  const INNER_COMPONENT_ID = 'innerContent';
  const TEST_COMPONENT_MODEL = { ':type': 'test/components/componentchild' };
  const TEST_PAGE_PATH = '/page/jcr:content/root';

  const Dummy = defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Dummy',
    inheritAttrs: false,
    props: {
      className: {
        type: String,
        default: '',
      },
    },
    setup() {
      const innerComponentId = INNER_COMPONENT_ID;
      return { innerComponentId };
    },
    template: `
      <div :id="innerComponentId" :class="className">Dummy</div>`,
  });

  const dummy = markRaw(Dummy);

  let addListenerSpy: jest.SpyInstance;
  let getDataSpy: jest.SpyInstance;

  beforeEach(() => {
    addListenerSpy = jest
      .spyOn(ModelManager, 'addListener')
      .mockImplementation();
    getDataSpy = jest
      .spyOn(ModelManager, 'getData')
      .mockResolvedValue(TEST_COMPONENT_MODEL);
  });

  describe('Tag instantiation ->', () => {
    beforeEach(() => {
      addListenerSpy.mockReset();
    });

    it('should initialize properly without parameter', () => {
      // @ts-ignore
      const wrapper = mount(ModelProvider, {
        propsData: {
          wrappedComponent: dummy,
        },
      });

      expect(addListenerSpy).toHaveBeenCalledWith('', expect.any(Function));

      const childNode = wrapper.find(`#${INNER_COMPONENT_ID}`);

      expect(childNode.exists()).toBeTruthy();
    });

    it('should initialize properly with a path parameter', () => {
      // @ts-ignore
      const wrapper = mount(ModelProvider, {
        propsData: {
          wrappedComponent: dummy,
          cqPath: TEST_PAGE_PATH,
        },
      });

      expect(addListenerSpy).toHaveBeenCalledWith(
        TEST_PAGE_PATH,
        expect.any(Function)
      );

      const childNode = wrapper.find(`#${INNER_COMPONENT_ID}`);

      expect(childNode.exists()).toBeTruthy();
    });
  });

  describe('Get data ->', () => {
    beforeEach(() => {
      getDataSpy.mockReset();
      addListenerSpy.mockReset();
    });

    it('should subscribe on the data with undefined parameters', () => {
      getDataSpy.mockResolvedValue({});
      // @ts-ignore
      mount(ModelProvider);

      expect(addListenerSpy).toHaveBeenCalledWith('', expect.any(Function));
    });

    it('should subscribe on the data with the provided attributes', () => {
      getDataSpy.mockResolvedValue({});
      // @ts-ignore
      mount(ModelProvider, {
        propsData: {
          wrappedComponent: dummy,
          cqPath: TEST_PAGE_PATH,
          cqForceReload: true,
        },
      });

      expect(addListenerSpy).toHaveBeenCalledWith(
        TEST_PAGE_PATH,
        expect.any(Function)
      );
    });
  });

  describe('CompositeModelProvider ->', () => {
    beforeEach(() => {
      addListenerSpy.mockReset();
    });

    it('should initialize properly without parameter', () => {
      // @ts-ignore
      const wrapper = mount(CompositeModelProvider, {
        propsData: {
          wrappedComponent: Dummy,
        },
      });
      expect(addListenerSpy).toHaveBeenCalledWith('', expect.any(Function));
      const childNode = wrapper.find(`#${INNER_COMPONENT_ID}`);
      expect(childNode.exists()).toBeTruthy();
    });

    it('should initialize properly with a path parameter', () => {
      // @ts-ignore
      const wrapper = mount(CompositeModelProvider, {
        propsData: {
          wrappedComponent: Dummy,
          cqPath: TEST_PAGE_PATH,
        },
      });
      expect(addListenerSpy).toHaveBeenCalledWith(
        TEST_PAGE_PATH,
        expect.any(Function)
      );
      const childNode = wrapper.find(`#${INNER_COMPONENT_ID}`);
      expect(childNode.exists()).toBeTruthy();
    });

    it('should render a subpage properly when page path is provided', () => {
      // @ts-ignore
      const wrapper = mount(CompositeModelProvider, {
        propsData: {
          wrappedComponent: Dummy,
          injectPropsOnInit: true,
          pagePath: TEST_PAGE_PATH,
        },
      });
      expect(getDataSpy).toHaveBeenCalledWith({
        path: TEST_PAGE_PATH,
        forceReload: false,
      });
      const childNode = wrapper.find(`#${INNER_COMPONENT_ID}`);
      expect(childNode.exists()).toBeTruthy();
    });

    it('should render components properly when component cqPath is provided', () => {
      // @ts-ignore
      const wrapper = mount(CompositeModelProvider, {
        propsData: {
          wrappedComponent: Dummy,
          injectPropsOnInit: true,
          cqPath: TEST_PAGE_PATH,
        },
      });
      expect(getDataSpy).toHaveBeenCalledWith({
        path: TEST_PAGE_PATH,
        forceReload: false,
      });
      const childNode = wrapper.find(`#${INNER_COMPONENT_ID}`);
      expect(childNode.exists()).toBeTruthy();
    });

    it('should render components properly when containing page path and path to item is provided', () => {
      addListenerSpy = jest
        .spyOn(ModelManager, 'addListener')
        .mockImplementationOnce((path, callback) => {
          callback();
        });

      const PAGE_PATH = '/page/subpage';
      const ITEM_PATH = 'root/paragraph';

      // @ts-ignore
      const wrapper = mount(CompositeModelProvider, {
        propsData: {
          wrappedComponent: Dummy,
          injectPropsOnInit: true,
          pagePath: PAGE_PATH,
          itemPath: ITEM_PATH,
        },
      });

      expect(addListenerSpy).toHaveBeenCalled();
      expect(getDataSpy).toHaveBeenCalledWith({
        path: `${PAGE_PATH}/jcr:content/${ITEM_PATH}`,
        forceReload: false,
      });

      const childNode = wrapper.find(`#${INNER_COMPONENT_ID}`);

      expect(childNode.exists()).toBeTruthy();
    });

    it('should log error when there is no data', async () => {
      // given
      const error = new Error('404 - Not found');
      getDataSpy.mockRejectedValue(error);
      // eslint-disable-next-line no-console
      console.log = jest.fn();

      // @ts-ignore
      const wrapper = mount(CompositeModelProvider, {
        propsData: {
          wrappedComponent: Dummy,
          injectPropsOnInit: true,
          cqPath: TEST_PAGE_PATH,
        },
      });
      // then
      // eslint-disable-next-line no-console
      await waitFor(() => expect(console.log).toHaveBeenCalledWith(error));
    });

    it('should fire event to reload editables when in editor', async () => {
      const dispatchEventSpy: jest.SpyInstance = jest
        .spyOn(PathUtils, 'dispatchGlobalCustomEvent')
        .mockImplementation();
      const isInEditor: jest.SpyInstance = jest
        .spyOn(Utils, 'isInEditor')
        .mockImplementation(() => true);
      // @ts-ignore
      const wrapper = mount(CompositeModelProvider, {
        propsData: {
          wrappedComponent: Dummy,
          injectPropsOnInit: true,
          pagePath: TEST_PAGE_PATH,
        },
      });
      expect(getDataSpy).toHaveBeenCalledWith({
        path: TEST_PAGE_PATH,
        forceReload: false,
      });
      const childNode = wrapper.find(`#${INNER_COMPONENT_ID}`);
      expect(childNode.exists()).toBeTruthy();
      await waitFor(() =>
        expect(dispatchEventSpy).toHaveBeenCalledWith(
          'cq-async-content-loaded',
          {}
        )
      );
      isInEditor.mockReset();
      dispatchEventSpy.mockReset();
    });
  });
  describe('Unmount -> ', () => {
    it('should remove listeners on unmount', () => {
      const removeListenerSpy: jest.SpyInstance = jest
        .spyOn(ModelManager, 'removeListener')
        .mockImplementation();

      // @ts-ignore
      mount(ModelProvider, {
        propsData: {
          wrappedComponent: dummy,
          cqPath: TEST_PAGE_PATH,
        },
      }).unmount();

      expect(removeListenerSpy).toHaveBeenCalledWith(
        TEST_PAGE_PATH,
        expect.any(Function)
      );
    });
  });
});
