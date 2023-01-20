/* eslint-disable import/no-unresolved,import/no-extraneous-dependencies */
import entryPlus from 'webpack-entry-plus';
import { DefinePlugin, IgnorePlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import EslintWebpackPlugin from 'eslint-webpack-plugin';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import path from 'path';

const sourceDirectory = path.join(process.cwd(), 'src');
const distributionDirectory = path.join(process.cwd(), 'dist');

const entryFiles = [
  {
    entryFiles: [path.resolve(sourceDirectory, './main.ts')],
    outputName: 'clientlib-vue/vue',
  },
];

const webpackConfig = (env, argv) => {
  const devServerPort = 3000;
  return {
    context: sourceDirectory,
    devtool: 'source-map',
    stats: {
      colors: true,
    },
    entry: entryPlus(entryFiles),
    output: {
      path: distributionDirectory,
      filename: '[name].bundle.js',
      assetModuleFilename: 'assets/[name][ext]',
    },
    resolve: {
      extensions: ['.ts', '.js', '.vue'],
      modules: [sourceDirectory, 'node_modules'],
      alias: {
        '@': sourceDirectory,
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          loader: 'babel-loader',
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'clientlibs/clientlib-vue/resources/assets/[name][ext]',
          },
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'clientlibs/clientlib-vue/resources/fonts/[name][ext]',
          },
        },
        {
          test: /favicon.ico/i,
          type: 'asset/resource',
          generator: {
            filename:
              argv.mode === 'production'
                ? 'clientlibs/clientlib-vue/resources/[name][ext]'
                : '[name][ext]',
          },
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new EslintWebpackPlugin({
        fix: true,
        failOnError: true,
      }),
      new HtmlWebPackPlugin({
        template: './index.html',
        filename: './index.html',
      }),
      new HtmlWebPackPlugin({
        template: './index.html',
        filename: './content/stanley/us/en/home.html',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].bundle.css',
      }),
      new VueLoaderPlugin(),
      new StyleLintPlugin({
        files: ['**/*.{vue,css}'],
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
      }),
      new DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: true,
      }),
    ],
    devServer: {
      static: {
        directory: distributionDirectory,
      },
      compress: true,
      hot: true,
      port: devServerPort,
      proxy: {
        context: (pathname) => {
          if (pathname.startsWith('/etc.clientlibs')) {
            return true;
          }
          if (
            pathname.startsWith('/content/stanley/') &&
            pathname.endsWith('.jpeg')
          ) {
            return true;
          }
          return false;
        },
        target: 'http://localhost:4502',
        auth: 'admin:admin',
        changeOrigin: true,
      },
      historyApiFallback: {
        rewrites: [{ from: /./, to: '/' }],
      },
    },
  };
};

export default webpackConfig;
