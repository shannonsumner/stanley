/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import clientlib from 'aem-clientlib-generator';

import { promises as fsPromises } from 'fs';

const directoryName = process.cwd();
const context = path.join(directoryName, 'dist');
const clientLibRoot = path.join(
  directoryName,
  '..',
  'ui.apps',
  'src',
  'main',
  'content',
  'jcr_root',
  'apps',
  'stanley',
  'clientlibs'
);

const libsBaseConfig = {
  allowProxy: true,
  serializationFormat: 'xml',
  cssProcessor: ['default:none', 'min:none'],
  jsProcessor: ['default:none', 'min:none'],
};

const updatevueResourcePath = async () => {
  try {
    const bundleFile = path.join(context, 'clientlib-vue', 'vue.bundle.css');
    const contents = await fsPromises.readFile(bundleFile, 'utf-8');
    const replaced = contents.replace(
      /..\/clientlibs\/clientlib-vue\/resources/gi,
      '../resources'
    );

    await fsPromises.writeFile(bundleFile, replaced);
  } catch (err) {
    console.log(err);
  }
};

const clientLibraryConfigurations = [
  {
    ...libsBaseConfig,
    name: 'clientlib-vue',
    categories: ['stanley.vue'],
    serializationFormat: 'xml',
    cssProcessor: ['default:none', 'min:none'],
    jsProcessor: ['default:none', 'min:none'],
    assets: {
      // Copy entrypoint scripts and stylesheets into the respective ClientLib
      // directories
      js: {
        cwd: 'clientlib-vue',
        files: ['**/*.js'],
        flatten: false,
      },
      css: {
        cwd: 'clientlib-vue',
        files: ['**/*.css'],
        flatten: false,
      },

      // Copy all other files into the `resources` ClientLib directory
      resources: {
        cwd: 'clientlibs/clientlib-vue/resources',
        files: ['**/*.*'],
        flatten: false,
        ignore: ['**/*.js', '**/*.css'],
      },
    },
  },
];

const options = {
  context,
  clientLibRoot,
  verbose: true,
};

await updatevueResourcePath();

clientlib(clientLibraryConfigurations, options, () => {
  console.log('generator has finished');
});
