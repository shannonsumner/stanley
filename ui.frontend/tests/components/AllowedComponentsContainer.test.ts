import { ComponentOptions, h } from 'vue';
import { mount } from '@vue/test-utils';
import AllowedComponentsContainer from '@/components/AllowedComponentsContainer.vue';
import AllowedComponentPlaceholderList from '@/components/AllowedComponentPlaceholderList.vue';
import AllowedComponentPlaceholder from '@/components/AllowedComponentPlaceholder.vue';

describe('AllowedComponentsContainer ->', () => {
  const DEFAULT_TITLE = 'Layout Container';
  const DEFAULT_EMPTY_LABEL = 'Empty label tests';
  const ALLOWED_PLACEHOLDER_SELECTOR = '.aem-AllowedComponent--list';
  const ALLOWED_COMPONENT_TITLE_SELECTOR = '.aem-AllowedComponent--title';
  const ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR =
    '.aem-AllowedComponent--component.cq-placeholder.placeholder';
  const COMPONENT_TEXT_PATH = '/content/page/jcr:content/root/text';
  const COMPONENT_TEXT_TITLE = 'Text';
  const COMPONENT_IMAGE_PATH = '/content/page/jcr:content/root/image';
  const COMPONENT_IMAGE_TITLE = 'Image';
  const CONTAINER_SELECTOR = '.aem-container';
  const CONTAINER_PLACEHOLDER_SELECTOR = '.new.section';

  const ALLOWED_COMPONENTS_EMPTY_DATA = {
    applicable: true,
    components: [],
  };

  const ALLOWED_COMPONENTS_NOT_APPLICABLE_DATA = {
    applicable: false,
    components: [],
  };

  const ALLOWED_COMPONENTS_DATA = {
    applicable: true,
    components: [
      {
        path: COMPONENT_TEXT_PATH,
        title: COMPONENT_TEXT_TITLE,
      },
      {
        path: COMPONENT_IMAGE_PATH,
        title: COMPONENT_IMAGE_TITLE,
      },
    ],
  };

  interface AllowedComponent {
    path: string;
    title: string;
  }

  const generateAllowedComponentsContainer = (
    allowedComponents: {
      applicable: boolean;
      components: AllowedComponent[];
    },
    isInEditor: boolean,
    title?: string
  ): ComponentOptions => {
    const props = {
      cqItems: {},
      cqItemsOrder: [],
      cqPath: '',
      cqType: '',
      isInEditor,
      title: title || '',
      allowedComponents,
    };

    return h(AllowedComponentsContainer, props);
  };

  describe('not applicable ->', () => {
    it('should NOT be applicable but have a default container placeholder', () => {
      const component = generateAllowedComponentsContainer(
        ALLOWED_COMPONENTS_NOT_APPLICABLE_DATA,
        true
      );
      const wrapper = mount(component);
      const allowedComponentsContainer = wrapper.find(
        ALLOWED_PLACEHOLDER_SELECTOR
      );
      expect(allowedComponentsContainer.exists()).toBeFalsy();
      const container = wrapper.find(CONTAINER_SELECTOR);
      expect(container.exists()).toBeTruthy();
      const containerPlaceholder = container.find(
        CONTAINER_PLACEHOLDER_SELECTOR
      );
      expect(containerPlaceholder.exists()).toBeTruthy();
    });
  });

  describe('applicable ->', () => {
    it('should be applicable with an empty list of allowed components', () => {
      const component = generateAllowedComponentsContainer(
        ALLOWED_COMPONENTS_EMPTY_DATA,
        true
      );
      const wrapper = mount(component);
      const allowedComponentsContainer = wrapper.find(
        ALLOWED_PLACEHOLDER_SELECTOR
      );
      expect(allowedComponentsContainer.exists()).toBeTruthy();
      const allowedComponentsTitle = allowedComponentsContainer.find(
        ALLOWED_COMPONENT_TITLE_SELECTOR
      );
      expect(allowedComponentsTitle.exists()).toBeTruthy();
      const allowedComponentsTitleAsElement =
        allowedComponentsTitle.element as HTMLElement;
      expect(allowedComponentsTitleAsElement.dataset.text).toEqual(
        'No allowed components'
      );
      expect(
        allowedComponentsContainer
          .find(ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR)
          .exists()
      ).toBeFalsy();
    });

    it('should be applicable with a list of allowed components', () => {
      const component = generateAllowedComponentsContainer(
        ALLOWED_COMPONENTS_DATA,
        true,
        DEFAULT_TITLE
      );
      const wrapper = mount(component);
      const allowedComponentsContainer = wrapper.find(
        ALLOWED_PLACEHOLDER_SELECTOR
      );
      expect(allowedComponentsContainer.exists()).toBeTruthy();
      const allowedComponentsTitle = allowedComponentsContainer.find(
        ALLOWED_COMPONENT_TITLE_SELECTOR
      );
      expect(allowedComponentsTitle.exists()).toBeTruthy();
      const allowedComponentsTitleAsElement =
        allowedComponentsTitle.element as HTMLElement;
      expect(allowedComponentsTitleAsElement.dataset.text).toEqual(
        DEFAULT_TITLE
      );
      expect(
        allowedComponentsContainer.findAll(
          ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR
        ).length
      ).toEqual(2);
    });
  });

  describe('not in editor ->', () => {
    it('should be applicable with a list of allowed components but not in the editor', () => {
      const component = generateAllowedComponentsContainer(
        ALLOWED_COMPONENTS_DATA,
        false
      );
      const wrapper = mount(component);
      const allowedComponentsContainer = wrapper.find(
        ALLOWED_PLACEHOLDER_SELECTOR
      );
      expect(allowedComponentsContainer.exists()).toBeFalsy();
      const container = wrapper.find(CONTAINER_SELECTOR);
      expect(container.exists()).toBeTruthy();
      const containerPlaceholder = container.find(
        CONTAINER_PLACEHOLDER_SELECTOR
      );
      expect(containerPlaceholder.exists()).toBeFalsy();
    });
  });

  describe('AllowedComponentPlaceholderList ->', () => {
    it('should display two allowed components', () => {
      const placeHolderProperties = {
        placeholderClassNames: 'classNames',
        cqPath: '/some/path',
      };

      // @ts-ignore
      const wrapper = mount(AllowedComponentPlaceholderList, {
        propsData: {
          title: DEFAULT_TITLE,
          emptyLabel: DEFAULT_EMPTY_LABEL,
          components: ALLOWED_COMPONENTS_DATA.components,
          cqPath: '/some/path',
          placeholderProps: placeHolderProperties,
        },
      });
      const allowedComponentPlaceholderList = wrapper.find(
        ALLOWED_PLACEHOLDER_SELECTOR
      );
      expect(allowedComponentPlaceholderList.exists()).toBeTruthy();
      const allowedComponentsTitle = allowedComponentPlaceholderList.find(
        ALLOWED_COMPONENT_TITLE_SELECTOR
      );
      expect(allowedComponentsTitle.exists()).toBeTruthy();
      const allowedComponentsTitleAsElement =
        allowedComponentsTitle.element as HTMLElement;
      expect(allowedComponentsTitleAsElement.dataset.text).toEqual(
        DEFAULT_TITLE
      );
      expect(
        allowedComponentPlaceholderList.findAll(
          ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR
        ).length
      ).toEqual(2);
    });
  });

  describe('AllowedComponentPlaceholder ->', () => {
    it('should display a path, emptyLabel and the expected class names', () => {
      // @ts-ignore
      const wrapper = mount(AllowedComponentPlaceholder, {
        propsData: {
          path: COMPONENT_TEXT_PATH,
          emptyLabel: COMPONENT_TEXT_TITLE,
        },
      });
      const allowedComponentPlaceholder = wrapper.find(
        ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR
      );
      expect(allowedComponentPlaceholder.exists()).toBeTruthy();
      const allowedComponentPlaceholderAsElement =
        allowedComponentPlaceholder.element as HTMLElement;
      expect(allowedComponentPlaceholderAsElement.dataset.emptytext).toEqual(
        COMPONENT_TEXT_TITLE
      );
      expect(allowedComponentPlaceholderAsElement.dataset.cqDataPath).toEqual(
        COMPONENT_TEXT_PATH
      );
    });
  });
});
