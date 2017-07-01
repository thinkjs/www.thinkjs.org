## Middleware

前面已经说过，3.0 是基于 Koa 2.0 来构建的，所以 koa 里的 middleware 完全可以在 ThinkJS 里使用。

在 Koa 中，一般是通过 `app.use` 的方式来使用中间件的，如：

```js
const app = new Koa();
const bodyparser = require('koa-bodyparser');
app.use(bodyparser({}));
```

在 ThinkJS 里，为了方便管理和使用 middleware，提供了一个统一的配置来管理 middleware，配置文件为 `src/config/middleware.js`。

### 配置格式

```
const path = require('path')
const isDev = think.env === 'development'

module.exports = [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev,
    },
  },
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/,
    },
  }
]
```

配置项整体为一个数组，里面每一项为一个具体的 middleware 配置。支持的配置项为：

* `handle` 具体的 middleware 处理函数
* `enable` 是否开启当前的 middleware
* `options` 传入给 middleware 的配置
* `match` 满足特定的条件才让 middleware 生效

#### handle

middleware 处理函数，支持多种方式。

* 使用框架内置的 middleware，如：[router](https://github.com/thinkjs/think-router)，[meta](https://github.com/thinkjs/think-meta)，[resource](https://github.com/thinkjs/think-resource)，[trace](https://github.com/thinkjs/think-trace)，[payload](https://github.com/thinkjs/think-payload)，[logic](https://github.com/thinkjs/think-logic)，[controller](https://github.com/thinkjs/think-controller)。

* 引入外部的 middleware，如：


也可以在项目里创建 middleware，然后使用。

#### enable

是否开启当前的 middleware，比如：某个 middleware 只在开发环境下才生效。

#### options

传递给 middleware 的配置项。

#### match
