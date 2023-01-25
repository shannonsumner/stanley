import { mount } from '@vue/test-utils';
import AemText from '@/components/AemText.vue';
import { Utils } from 'aem-vue-editable-components';

describe('Text ->', () => {
  const RTE_EDIT_ELEMENT_DATA_ATTR = 'data-rte-editelement';
  const CONTENT_PATH = '/content/test/cq/path';
  const TEXT_DATA_CLASS_NAME = 'text-data-selector';
  const TEXT_DATA_STR = 'dummy string text';
  const TEXT_DATA = `<span class="${TEXT_DATA_CLASS_NAME}">${TEXT_DATA_STR}</span>`;

  it('should render the text component with no parameter', () => {
    const wrapper = mount(AemText);
    const { element } = wrapper;
    expect(element.hasAttribute(RTE_EDIT_ELEMENT_DATA_ATTR)).toBeTruthy();
  });

  it('should render the text component that contains the provided text as a string', () => {
    // @ts-ignore
    const wrapper = mount(AemText, {
      propsData: {
        text: TEXT_DATA,
        richText: true,
      },
    });
    const { element } = wrapper;
    expect(element.innerHTML === TEXT_DATA).toBeTruthy();
  });

  it('should render the text component that contains the provided text as a DOM structure', () => {
    // @ts-ignore
    const wrapper = mount(AemText, {
      propsData: {
        text: TEXT_DATA,
        richText: true,
      },
    });

    const textDataSelector = wrapper.find(`.${TEXT_DATA_CLASS_NAME}`);
    expect(textDataSelector.element.innerHTML === TEXT_DATA_STR).toBeTruthy();
  });

  it('should render the text as a rich text component with a given id', () => {
    // @ts-ignore
    const wrapper = mount(AemText, {
      propsData: {
        text: TEXT_DATA,
        richText: true,
        cqPath: CONTENT_PATH,
      },
    });

    const { element } = wrapper;
    expect(element.id === Utils.extractModelId(CONTENT_PATH)).toBeTruthy();
  });
});
