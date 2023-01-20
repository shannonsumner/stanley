import {
  AuthoringUtils,
  Constants,
  Model,
} from '@adobe/aem-spa-page-model-manager';
import { h, VNode } from 'vue';
import normalize from 'path-normalize';
import { ComponentMapping } from '@adobe/aem-spa-component-mapping';

interface ComponentProps {
  pagePath?: string;
  itemPath?: string;
  cqPath?: string;
  /**
   * Should the component data be retrieved from the aem page model
   * and passed down as props on componentMount
   */
  injectPropsOnInit?: boolean;
}

interface PageModel extends Model {
  ':type': string;
  id: string;
  ':path': string;
  ':children'?: { [key: string]: PageModel };
}

const Utils = {
  connectComponentWithItem(
    cqPath: string,
    ItemComponent: any,
    itemProps: any,
    itemKey: string,
    containerProps: Record<string, any> | void,
    isInEditor: boolean,
    addJcrContentToPath = false
  ) {
    const itemPath = this.getItemPath(cqPath, itemKey, addJcrContentToPath);
    ItemComponent.inheritAttrs = false;

    const itemComponentProperties = {
      ...itemProps,
      cqPath: itemPath,
      isInEditor,
      containerProps,
    };

    return h(ItemComponent, itemComponentProperties);
  },

  extractModelId(path: string) {
    return path && path.replace(/\/|:/g, '_');
  },

  getChildComponents(
    cqPath: string,
    cqItems: { [key: string]: Model },
    cqItemsOrder: string[],
    containerProps: (itemKey: string) => Record<string, any> | void,
    isInEditor: boolean,
    addJcrContentToPath: boolean,
    componentMapping: typeof ComponentMapping
  ) {
    const childComponents: VNode[] = [];
    if (cqItems && cqItemsOrder) {
      cqItemsOrder.forEach((cqItem) => {
        const childProps = Utils.modelToProps(cqItems[cqItem]);
        const childComponent = componentMapping.get(childProps.cqType);

        if (childComponent) {
          const properties = containerProps(cqItem);
          childComponents.push(
            Utils.connectComponentWithItem(
              cqPath,
              childComponent,
              childProps,
              cqItem,
              properties,
              isInEditor,
              addJcrContentToPath
            )
          );
        }
      });
    }
    return childComponents;
  },

  getChildPages(
    cqChildren: { [key: string]: PageModel },
    componentMapping: typeof ComponentMapping
  ) {
    const childPages: VNode[] = [];
    if (!cqChildren) {
      return childPages;
    }
    Object.keys(cqChildren).forEach((cqChild) => {
      const childProps = Utils.modelToProps(cqChildren[cqChild]);
      const childPage = componentMapping.get(childProps.cqType);

      if (childPage) {
        childPages.push(h(childPage, childProps));
      }
    });
    return childPages;
  },

  getCQPath(componentProps: ComponentProps) {
    const { pagePath = '', itemPath = '', injectPropsOnInit } = componentProps;
    let { cqPath = '' } = componentProps;
    if (injectPropsOnInit && !cqPath) {
      cqPath = normalize(
        itemPath ? `${pagePath}/jcr:content/${itemPath}` : pagePath
      );
      cqPath = cqPath.replace(/^\.$/, '');
    }
    return cqPath;
  },

  getItemPath(cqPath: string, itemKey: string, addJcrContentToPath = false) {
    let itemPath = cqPath ? `${cqPath}/${itemKey}` : itemKey;
    if (addJcrContentToPath) {
      itemPath = cqPath
        ? `${cqPath}/${Constants.JCR_CONTENT}/${itemKey}`
        : itemKey;
    }
    return itemPath;
  },

  isInEditor(): boolean {
    return AuthoringUtils.isInEditor();
  },

  modelToProps(item: Model) {
    /**
     * Transformation of internal properties namespaced with [:] to [cq]
     * :myProperty => cqMyProperty
     * @param propKey
     */
    const transformToCQ = (propKey: string) => {
      const tempKey = propKey.substring(1);

      return `cq${tempKey.substring(0, 1).toUpperCase()}${tempKey.substring(
        1
      )}`;
    };

    const keys = Object.getOwnPropertyNames(item);
    const props: any = {};

    keys.forEach((key) => {
      let propKey: string = key;

      if (propKey.startsWith(':')) {
        propKey = transformToCQ(propKey);
      }

      // @ts-ignore
      props[propKey] = item[key];
    });

    return props;
  },
};

export default Utils;
