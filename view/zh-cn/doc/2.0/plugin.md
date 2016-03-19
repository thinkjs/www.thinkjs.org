## 开发插件

ThinkJS 2.0 里支持 2 种类型的插件，一种是 [Middleware](./middleware.html)，另一种是 [Adapter](./adapter_intro.html)。

### 创建插件

可以通过下面的命令创建一个插件，插件命令建议使用 `think-` 打头。

```sh
thinkjs plugin think-xxx
```

执行后，会自动创建 `think-xxx` 目录，并可以看到类似下面的信息：

```text
  create : think-xxx/
  create : think-xxx/src
  create : think-xxx/src/index.js
  create : think-xxx/test
  create : think-xxx/test/index.js
  create : think-xxx/.eslintrc
  create : think-xxx/.npmignore
  create : think-xxx/.travis.yml
  create : think-xxx/package.json
  create : think-xxx/README.md

  enter path:
  $ cd think-xxx/

  install dependencies:
  $ npm install

  watch compile:
  $ npm run watch-compile

  run test:
  $ npm run test-cov
```

### 目录结构

* `src/` 存放源代码，使用 ES6/7 特性开发
* `test/` 单元测试目录
* `.eslintrc` eslint 检查配置文件
* `.npmignore` npm 发布时忽略的文件
* `.travis.yml`  travis 持续集成配置文件
* `package.json` npm 配置文件
* `README.md` 说明文件


### 安装依赖

```sh
npm install --verbose
```

### 开发

代码文件为 `src/index.js`，默认生成的文件只是一个基本的类输出，没有继承任何类。

如果是 Middleware，需要继承 `think.middleware.base` 类。如果是 Adapter，需要继承 `think.adapter.base` 类。

开发过程中，可以在命令行下执行 `npm run watch-compile`，这样文件修改后就会立即编译。

### 单元测试

在 `test/index.js` 文件书写相关的单元测试，测试框架使用的是 mocha，可以通过下面的命令查看单元测试结果。

```sh
npm run test-cov
```

### 说明文档

代码开发和单元测试完成后，需要在 `README.md` 里书写详细的说明文档。

### 发布

可以通过 `npm publish` 发布模块到 npm 仓库里（如果之前没发布过，会提示创建帐号和密码）。

发布完成后，可以联系 ThinkJS-Team，经确认无误后，可以添加到官方的插件列表中，并领取相关的奖励。