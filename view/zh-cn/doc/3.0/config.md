## Config / 配置

实际项目中，肯定需要各种配置，包括：框架需要的配置以及项目自定义的配置。ThinkJS 将所有的配置都统一管理，文件都放在 `src/config/` 目录下（多模块项目放在 `src/common/config/`），并根据不同的功能划分为不同的配置文件。

* `config.js` 通用的一些配置
* `adapter.js` adapter 配置
* `router.js` 自定义路由配置
* `middleware.js` middlware 配置
* `validator.js` 数据校验配置
* `extend.js` extend 配置

### 配置格式


```js
// src/config.js

module.exports = {
  port: 1234,
  redis: {
    host: '192.168.1.2',
    port: 2456,
    password: ''
  }
}
```

配置值即可以是一个简单的字符串，也可以是一个复杂的对象，具体是什么类型根据具体的需求来决定。

### 多环境配置

有些配置需要在不同的环境下配置不同的值，如：数据库的配置在开发环境和生产环境是不一样的，此时可以通过环境下对应不同的配置文件来完成。

多环境配置文件格式为：`[name].[env].js`，如：`config.development.js`，`config.production.js`

在以上的配置文件中，目前只有 `config.js` 和 `adapter.js` 是支持不同环境配置文件的。

### 系统默认配置

系统内置一些默认配置，方便项目里直接使用，具体有：

* [config.js](https://github.com/thinkjs/thinkjs/blob/3.0/lib/config/config.js) 通用的默认配置

  ```js
  {
    port: 8360, // server port
    host: '127.0.0.1', // server host
    workers: 0, // server workers num, if value is 0 then get cpus num
    createServer: undefined, // create server function
    startServerTimeout: 3000, // before start server time
    reloadSignal: 'SIGUSR2', // reload process signal
    onUnhandledRejection: err => think.logger.error(err), // unhandledRejection handle
    onUncaughtException: err => think.logger.error(err), // uncaughtException handle
    processKillTimeout: 10 * 1000, // process kill timeout, default is 10s
    enableAgent: false, // enable agent worker
    jsonpCallbackField: 'callback', // jsonp callback field
    jsonContentType: 'application/json', // json content type
    errnoField: 'errno', // errno field
    errmsgField: 'errmsg', // errmsg field
    defaultErrno: 1000, // default errno
    validateDefaultErrno: 1001 // validate default errno
  };
  ```
* [adapter.js](https://github.com/thinkjs/thinkjs/blob/3.0/lib/config/adapter.js) adapter 默认配置

  ```js
  exports.logger = {
    type: 'console',
    console: {
      handle: ConsoleLogger
    },
    file: {
      handle: FileLogger,
      filename: path.join(think.ROOT_PATH, 'logs/file.log'),
      maxLogSize: 50 * 1024, // 50M
      backups: 10 // max chunk number
    },
    dateFile: {
      handle: DateFileLogger,
      level: 'ALL',
      filename: path.join(think.ROOT_PATH, 'logs/file.log'),
      pattern: '-yyyy-MM-dd',
      alwaysIncludePattern: false
    }
  };
  ```
* [adapter.production.js](https://github.com/thinkjs/thinkjs/blob/3.0/lib/config/adapter.production.js) adapter 生产环境默认配置
  ```js
  exports.logger = {
    type: 'dateFile'
  };
  ```
* [extend.js](https://github.com/thinkjs/thinkjs/blob/3.0/lib/config/extend.js) extend 默认配置
  ```js
  const cache = require('think-cache');
  const session = require('think-session');

  module.exports = [
    cache,
    session
  ];
  ```

### 配置合并方式

系统启动时，会对配置合并，最终提供给开发者使用。具体流程为：

* 加载 `[ThinkJS]/lib/config.js`
* 加载 `[ThinkJS]/lib/config.[env].js`
* 加载 `[ThinkJS]/lib/adapter.js`
* 加载 `[ThinkJS]/lib/adapter.[env].js`
* 加载 `src/config/config.js`
* 加载 `src/config/config.[env].js`
* 加载 `src/config/adapter.js`
* 加载 `src/config/adapter.[env].js`

`[env]` 为当前环境名称。最终会将这些配置按顺序合并在一起，同名的 key 后面会覆盖前面的。

配置加载是通过 [think-loader](https://github.com/thinkjs/think-loader/) 模块实现的，获取到合并后的配置后，通过 [think-config](https://github.com/thinkjs/think-config/) 模块实例化后放在 `think.config` 上，后续通过 `think.config` 来获取或者设置配置。

### 使用配置

框架提供了在不同的环境下不同的方式快速获取配置：

* 在 ctx 中，可以通过 `ctx.config(key)` 来获取配置
* 在 controller 中，可以通过 `controller.config(key)` 来获取配置
* 其他情况下，可以通过 `think.config(key)` 来获取配置

实际上，`ctx.config` 和 `controller.config` 是基于 `think.config` 包装的一种更方便的获取配置的方式。

```js
const redis = ctx.config('redis'); //获取 redis 配置
```

```js
module.exports = class extends think.Controller {
  indexAction() {
    const redis = this.config('redis'); // 在 controller 中通过 this.config 获取配置
  }
}
```

### 动态设置配置

除了获取配置，有时候需要动态设置配置，如：将有些配置保存在数据库中，项目启动时将配置从数据库中读取出来，然后设置上去。

框架也提供了动态设置配置的方式，如：`think.config(key, value)`

```
// src/bootstrap/worker.js

//HTTP 服务启动前执行
think.beforeStartServer(async () => {
  const config = await think.model('config').select();
  think.config('userConfig', config); //从数据库中将配置读取出来，然后设置
})
```

### 常见问题

#### 能否将请求中跟用户相关的值设置到配置中？

`不能`。配置设置是全局的，会在所有请求中生效。如果将请求中跟用户相关的值设置到配置中，那么多个用户同时请求时会相互干扰。

#### config.js 和 adapter.js 中的 key 能否重名？

`不能`。由于 config.js 和 adapter.js 是合并在一起的，所以要注意这二个配置不能有相同的 key，否则会被覆盖。

#### 怎么查看合并后的所有配置？

系统启动时，会合并 config.js 和 adapter.js 的配置，最终会将配置写到文件 `runtime/config/[env].json` 文件中，如：当前 env 是 `development`，那么写入的文件为 `runtime/config/development.json`。

配置写入文件时，是通过 `JSON.stringify` 将配置转化为字符串，由于 JSON.stringify 不支持正则、函数等之类的转换，所以配置中由于字段的值是正则或者函数时，生成的配置文件中将看不到这些字段对应的值。


#### 多模块项目配置文件存放位置？

以上文档中描述的配置文件路径都是单模块项目下的，多模块项目下配置文件的路径为 `src/common/config/`，配置文件名称以及格式和单模块相同，如：`src/common/config/config.js`、`src/common/config/adapter.js`、`src/common/config/middleware.js` 等。

多模块项目下有些配置可以放在模块目录下，路径为：`/src/[module]/config/`，`[module]` 为具体的模块名称。

#### 如何查看配置文件的详细加载情况？

有时候希望查看配置文件的详细加载情况，这时候可以通过 `DEBUG=think-loader-config-* npm start` 来启动项目查看。

```text
think-loader-config-40322 load file: //demo/app/config/adapter.js +3ms
think-loader-config-40323 load file: /demo/node_modules/thinkjs/lib/config/adapter.js +5ms
think-loader-config-40320 load file: /demo/app/config/adapter.js +4ms
think-loader-config-40323 load file: /demo/app/config/adapter.js +3ms
think-loader-config-40325 load file: /demo/app/config/config.js +0ms
think-loader-config-40325 load file: /demo/node_modules/thinkjs/lib/config/adapter.js +5ms
think-loader-config-40325 load file: /demo/app/config/adapter.js +3ms
think-loader-config-40321 load file: /demo/app/config/config.js +0ms
think-loader-config-40321 load file: /demo/node_modules/thinkjs/lib/config/adapter.js +5ms
think-loader-config-40321 load file: /demo/app/config/adapter.js +3ms
think-loader-config-40324 load file: /demo/app/config/config.js +0ms
think-loader-config-40319 load file: /demo/app/config/config.js +0ms
think-loader-config-40319 load file: /demo/node_modules/thinkjs/lib/config/adapter.js +6ms
think-loader-config-40324 load file: /demo/node_modules/thinkjs/lib/config/adapter.js +5ms
think-loader-config-40319 load file: /demo/app/config/adapter.js +7ms
think-loader-config-40324 load file: /demo/app/config/adapter.js +8ms
```
由于服务是通过 Master + 多个 Worker 启动的，debug 信息会打印多遍，这里为了区分加上了进程的 pid 值，如：`think-loader-config-40322` 为进程 pid 为 `40322` 下的配置文件加载情况。
