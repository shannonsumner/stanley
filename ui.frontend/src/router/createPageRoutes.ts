import { Model } from '@adobe/aem-spa-page-model-manager';
import { RouteComponent } from 'vue-router';
import { ComponentMapping, Utils } from 'aem-vue-editable-components';

const createPageRoutes = (
  cqChildren: { [key: string]: Model },
  componentMapping: typeof ComponentMapping
) => {
  const routes: Record<string, any>[] = [];
  if (cqChildren) {
    Object.keys(cqChildren).forEach((cqChild) => {
      const childProps = Utils.modelToProps(cqChildren[cqChild]);
      const childPage = componentMapping.get(
        childProps.cqType
      ) as RouteComponent;

      if (childPage) {
        // childPages.push(h(childPage, childProps));
        const routePath = `${cqChild}.html`;
        const routeRecord = {
          path: routePath,
          component: childPage,
          props: childProps,
        };
        routes.push(routeRecord);
      }
    });
  }

  return routes;
};

export default createPageRoutes;
