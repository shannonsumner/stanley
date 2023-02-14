import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { Constants, ModelManager } from '@adobe/aem-spa-page-model-manager';
import LocalDevModelClient from '@/config/LocalDevModelClient';
import NotFound from '@/components/NotFound.vue';
import SpaRoot from '@/components/SpaRoot.vue';
import '@/import-components';
import {
  ComponentMapping,
  CompositeModelProvider,
} from 'aem-vue-editable-components';
import createPageRoutes from '@/router/createPageRoutes';
import environment from '@/environment.json';
import '@/favicon.ico';

declare global {
  interface Window {
    environment: string;
    ModelManager: typeof ModelManager;
  }
}
let environmentVariables = environment?.dev || {};

if (typeof window.environment === 'undefined') {
  environmentVariables = environment?.prod;
}

const modelManagerOptions: { modelClient?: any } = {};

if (environmentVariables.VUE_APP_PROXY_ENABLED) {
  modelManagerOptions.modelClient = new LocalDevModelClient(
    environmentVariables.VUE_APP_API_HOST,
    environmentVariables.VUE_APP_AEM_AUTHORIZATION_HEADER
  );
}

document.addEventListener('DOMContentLoaded', () => {
  ModelManager.initialize(modelManagerOptions).then((pageModel) => {
    window.ModelManager = ModelManager;
    const routes = [
      { path: '/', redirect: '/content/stanley/us/en/home.html' },
      { path: '/404', component: NotFound },
    ];

    const router = createRouter({
      history: createWebHistory(),
      // @ts-ignore
      routes: [
        ...routes,
        ...createPageRoutes(
          pageModel[Constants.CHILDREN_PROP]!,
          new ComponentMapping()
        ),
      ],
    });

    const app = createApp(CompositeModelProvider, {
      wrappedComponent: SpaRoot,
      cqChildren: pageModel[Constants.CHILDREN_PROP],
      cqItems: pageModel[Constants.ITEMS_PROP],
      cqItemsOrder: pageModel[Constants.ITEMS_ORDER_PROP],
      cqPath: pageModel[Constants.PATH_PROP],
      locationPathname: window.location.pathname,
    });

    app.use(router);
    app.mount('#spa-root');
  });
});
