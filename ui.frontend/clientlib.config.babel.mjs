/* eslint-disable import/no-extraneous-dependencies */
import { URL } from 'url';
import path from 'path';
import clientlib from 'aem-clientlib-generator';

import { readdirSync, promises as fsPromises } from 'fs';

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const directoryName = new URL('.', import.meta.url).pathname;
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

const componentResourcesPath = path.join(context, 'clientlibs', 'stanley.vue', 'resources');

const updatevueResourcePath = async () => {
  try {
    const contents = await fsPromises.readFile('./dist/clientlib-vue/vue.bundle.css', 'utf-8');
    const replaced = contents.replace(
      /..\/clientlibs\/clientlib-vue\/resources/gi,
      '../resources'
    );

    await fsPromises.writeFile('./dist/clientlib-vue/vue.bundle.css', replaced);
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
