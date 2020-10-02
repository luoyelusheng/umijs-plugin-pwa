# umijs-plugin-pwa

[![NPM version](https://img.shields.io/npm/v/umijs-plugin-pwa.svg?style=flat)](https://npmjs.org/package/umijs-plugin-pwa) [![NPM downloads](http://img.shields.io/npm/dm/umijs-plugin-pwa.svg?style=flat)](https://npmjs.org/package/umijs-plugin-pwa)

## 安装

```bash
# or yarn
$ npm install
```

```bash
$ npm run build --watch
$ npm run start
```

## 使用

在`.umirc.js`添加配置,支持传入

```js
export default {
  pwa: {
    src: 'manifest.json',
    manifest: {
      name: 'PWA',
    },
    hash: true,
    appStatusBar: '#fff',
  },
  plugins: [['umijs-plugin-pwa']],
};
```

## Options

`appStatusBar`: ios 特定值，其最终会渲染成 <br/>

```js
<meta name="apple-mobile-web-app-status-bar-style" content="#fff" />
```

`manifest`: 直接指定 pwa 的 manifest 配置值，最终会生成为 manifest.json，如果既指定了 src 路径，则会将覆盖到 src 的 manifest.json 文件中，默认 manifest 的优先级最高。

`src`: 可在 src 目录下创建`manifest.json`文件指定地址，必须为`json`文件 <br/>

`hash`: 是否生成 hash 值，开启效果如下

```js
<link rel="manifest" type="json" href="./manifest.json?v=uuWlArby8" />
```

## LICENSE

MIT
