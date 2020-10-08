import cpy from 'cpy';
import assert from 'assert';
import writeJsonFile from 'write-json-file';
import loadJsonFile from 'load-json-file';
import shortid from 'shortid';
import { PwaManifest } from './typing';
import { GenerateSW } from 'workbox-webpack-plugin';
import chalk from 'chalk';
import { IApi } from '@umijs/types';

export default function(api: IApi) {
  const {
    paths: { absOutputPath, absSrcPath },
    userConfig: { pwa = {} },
  } = api;

  const manifest: PwaManifest = {};
  const options = pwa || {};
  const v: string = shortid.generate();

  api.describe({
    key: 'pwa',
    config: {
      default: {
        manifest,
        appStatusBar: '#fff',
      },
      schema(joi) {
        return joi.object();
      },
    },
  });

  if (process.env.NODE_ENV === 'production') {
    // api.addEntryImports(async () => {
    //   return [
    //     {
    //       source: `${__dirname}/registerServiceWorker.js`,
    //       specifier: 'registerServiceWorker',
    //     },
    //   ];
    // });

    api.addHTMLHeadScripts(async () => {
      await cpy(`${__dirname}/registerServiceWorker.js`, `${absOutputPath}`);
      await cpy(`${__dirname}/pwacompat.min.js`, `${absOutputPath}`);
      return [
        {
          src: `./pwacompat.min.js`,
          async: true,
        },
        {
          src: `./registerServiceWorker.js`,
        },
      ];
    });

    api.onBuildComplete(async ({ err }) => {
      if (!err) {
        const src: string = options.src;
        let manifestSrc: string = `${__dirname}/manifest.json`;

        if (src) {
          manifestSrc = `${absSrcPath}/${src}`;

          const extension = src.substring(src.lastIndexOf('.') + 1);

          assert(
            extension === 'json',
            `The manifest file must be a ${chalk.underline.cyan(
              'json',
            )} file，Your current file type is ${chalk.underline.cyan(
              extension,
            )}.`,
          );
        }

        const defaultManifest = await loadJsonFile(manifestSrc);

        await cpy(manifestSrc, `${absOutputPath}`, {
          rename: () => 'manifest.json',
        });

        const mergeManifest = Object.assign(
          {},
          defaultManifest,
          options.manifest,
        );

        await writeJsonFile(`${absOutputPath}/manifest.json`, mergeManifest);
      }
    });

    api.addHTMLMetas(() => {
      return [
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: options.appStatusBar,
        },
      ];
    });

    api.addHTMLLinks(() => {
      let href: string = './manifest.json';
      if (options.hash) {
        href += '?v=' + v;
      }
      return [
        {
          rel: 'manifest',
          type: 'json',
          href,
        },
      ];
    });

    api.chainWebpack(config => {
      config.plugin('workbox').use(GenerateSW, [
        {
          swDest: 'sw.js',
          importWorkboxFrom: 'local',
        },
      ]);
      return config;
    });
  }
}
