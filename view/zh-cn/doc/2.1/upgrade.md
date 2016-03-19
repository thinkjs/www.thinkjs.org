## 升级指南

本文档为 2.0 到 2.1 的升级指南，1.x 到 2.0 升级指南请见[这里](/doc/2.0/upgrade.html)。 

2.1 版本兼容 2.0 版本，只是添加了很多功能和微调了一些东西，具体的修改列表请见 [ChangeLog](/changelog.html)。

### 2.0 升级到 2.1

#### 升级依赖的 ThinkJS 版本

将 `package.json` 里依赖的 ThinkJS 版本修改为 `2.1.x`。

#### Babel 升级到 6

ThinkJS 2.0 是基于 Babel 5 编译的，2.1 版本将依赖的 Babel 升级到 6，所以需要修改 Babel 相关的依赖。

可以删除 `package.json` 里相关的 Babel 依赖，并添加如下的依赖：

```js
  "dependencies": {
    "babel-runtime": "6.x.x"
  },
  "devDependencies": {
    "babel-cli": "6.x.x",
    "babel-preset-es2015-loose": "6.x.x",
    "babel-preset-stage-1": "6.x.x",
    "babel-plugin-transform-runtime": "6.x.x",
    "babel-core": "6.x.x"
  }
```

修改完成后，执行 `npm install` 安装对应的依赖，删除 `app/` 目录，执行 `npm start` 启动项目。

#### 修改 compile 命令

将 `package.json` 里原有的 compile 命令修改为 `babel --presets es2015-loose,stage-1 --plugins transform-runtime src/ --out-dir app/ --retain-lines`。


#### 添加 RUNTIME_PATH

修改 `www/development.js`，`www/testing.js` 和 `www/production.js` 3 个文件，在实例化的时候添加 `RUNTIME_PATH` 的定义，如：

```js
var instance = new thinkjs({
  APP_PATH: rootPath + path.sep + 'app',
  RUNTIME_PATH: rootPath + path.sep + 'runtime', //添加 RUNTIME_PATH 路径的定义
  ROOT_PATH: rootPath,
  RESOURCE_PATH: __dirname,
  env: 'development'
});
```

其中 `RUNTIME_PATH: rootPath + path.sep + "runtime"` 即为需要添加的代码。

### 项目升级为 TypeScript

项目升级为 TypeScript 请见[这里](./typescript.html#toc-600)。

