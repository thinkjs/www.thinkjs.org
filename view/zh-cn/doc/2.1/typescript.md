## TypeScript

[TypeScript](http://www.typescriptlang.org/) 是一种由微软开发的自由和开源的编程语言。它是 JavaScript 的一个超集，向这个语言添加了可选的静态类型，在大型项目里非常有用。

ThinkJS 2.1 开始支持了创建 TypeScript 类型的项目，并且开发时会自动编译、自动更新，无需手工编译等复杂的操作。

### 创建 TypeScript 项目

可以通过指定 `--ts` 参数来创建 TypeScript 项目：

```sh
thinkjs new thinkjs_demo --ts
```

TypeScript 项目的文件后缀是 `.ts`。如果手工建立一些文件，后缀名也要是 `.ts`，否则调用 `tsc` 编译时会报错。

### .d.ts 文件

`.d.ts` 文件为第三方类库的描述文件。创建项目时，会创建文件 `typings/thinkjs/think.d.ts`，该文件为 ThinkJS 的描述文件。项目里的文件可以通过下面的方式引入这个描述文件：

```js
/// <reference path="../../../typings/thinkjs/think.d.ts" />
```

该代码必须放在文件的最前面，同时保持相对路径正确。如果文件有 `use strict` 也要放在这个后面，否则不会识别。

如果项目里还引入了其他第三方库，那么就需要安装对应的描述文件。可以通过 [tsd](http://definitelytyped.org/tsd/) 工具来安装。

第三方类库的描述文件列表可以从 <https://github.com/DefinitelyTyped/DefinitelyTyped> 找到，基本覆盖了一些比较热门的类库。


### TypeScript 编译

由于 TypeScript 的编译功能有很多缺陷，所以现在的方案是通过 TypeScript 将 `.ts` 代码编译为 ES6 代码，然后使用 Babel 6 编译为 ES5 代码。

如果发现 TypeScript 有问题，可以给 TypeScript 提 issue，帮助完善，地址为：<https://github.com/Microsoft/TypeScript>。

### 已有项目升级为 TypeScript 项目

对于已有用 ES6/7 特性开发的项目可以很方便的升级为 TypeScript 项目，具体如下：

#### 修改入口文件

修改入口文件 `www/development.js`，将之前 `compile` 相关的代码改为：

```js
//compile src/ to app/
instance.compile({
  log: true,
  type: 'ts' //TypeScript
});
```

#### 修改 package.json

修改配置文件 `package.json`，删除之前 `Babel` 和 `ThinkJS` 相关模块的依赖，添加如下的依赖：

```
{
  "dependencies": {
    "thinkjs": "2.1.x",
    "babel-runtime": "6.x.x"
  },
  "devDependencies": {
    "typescript": "next",
    "babel-cli": "6.x.x",
    "babel-preset-es2015-loose": "6.x.x",
    "babel-preset-stage-1": "6.x.x",
    "babel-plugin-transform-runtime": "6.x.x",
    "babel-core": "6.x.x"
  }
}
```

如果 `dependencies` 和 `devDependencies` 里已经有一些项目里要用的模块依赖，需要合并在一起。

修改完成后，执行 `npm install` 安装对应的依赖。

#### 修改 .thinkjsrc

修改项目配置文件 `.thinkjsrc`，修改为类似如下的配置：

```json
{
  "createAt": "2016-01-13 17:27:19",
  "mode": "module",
  "ts": true
}
```

#### 下载 think.d.ts 描述文件

下载文件 <https://github.com/75team/thinkjs/blob/master/template/think.d.ts>，保存为 `typings/thinkjs/think.d.ts`。

#### 修改文件后缀

将 `src/` 目录下所有的 `.js` 文件修改为 `.ts` 文件。

#### 添加 bin/compile.js 文件

下载文件 <https://github.com/75team/thinkjs/blob/master/template/bin/compile.ts>，保存为 `bin/compile.js`。

#### 修改 compile 命令

将 `package.json` 里原有的 compile 命令修改为 `node bin/compile.js`。

#### 项目文件里添加描述文件

在 `src/` 目录下所有文件内容顶部加上如下的代码，要注意相对路径是否正确：

```js
/// <reference path="../../../typings/thinkjs/think.d.ts" />
```

全部修改后，执行 `npm start` 就可以启动服务了。

