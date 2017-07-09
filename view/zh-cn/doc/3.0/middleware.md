## Middleware

由于 3.0 是在 Koa@2 版本之上构建的，所以完全兼容 Koa@2 里的 middleware。

在 Koa 中，一般是通过 `app.use` 的方式来使用中间件的，如：

```js
const app = new Koa();
const bodyparser = require('koa-bodyparser');
app.use(bodyparser({}));
```

为了方便管理和使用 middleware，ThinkJS 提供了一个统一的配置来管理 middleware，配置文件为 `src/config/middleware.js`。

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

配置项为项目中要使用的 middleware 列表，每一项支持 `handle`，`enable`，`options`，`match` 等属性。

#### handle

middleware 的处理函数，可以用系统内置的，也可以是引入外部的，也可以是项目里的 middleware。

middleware 的函数格式为：

```js
module.exports = (options, app) => {
  return (ctx, next) => {

  }
}
```

这里 middleware 接收的参数除了 options 外，还多了个 `app` 对象，该对象为 Koa Application 的实例。middleware 执行是一个洋葱模型，中可以通过 next 来控制是否执行后续的行为。


#### enable

是否开启当前的 middleware，比如：某个 middleware 只在开发环境下才生效。

```js
{
  handle: 'resouce',
  enable: think.env === 'development' //这个 middleware 只在开发环境下生效
}
```

#### options

传递给 middleware 的配置项，格式为一个对象。

```js
module.exports = [
  {
    handle: 
  }
]
```

#### match

匹配特定的规则后才执行该 middleware，支持二种方式，一种是路径匹配，一种是自定义函数匹配。如：

```js
module.exports = [
  {
    handle: 'xxx-middleware',
    match: '/resource' //请求的 URL 是 /resource 打头时才生效这个 middleware
  }
]
```

```js
module.exports = [
  {
    handle: 'xxx-middleware',
    match: ctx => { // match 为一个函数，将 ctx 传递给这个函数，如果返回结果为 true，则启用该 middleware
      return true;
    }
  }
]
```

### 框架内置的 middleware

框架内置了几个 middleware，可以通过字符串的方式直接引用。

```js
module.exports = [
  {
    handle: 'meta',
    options: {}
  }
]
```

* [meta](https://github.com/thinkjs/think-meta) 显示一些 meta 信息，如：发送 ThinkJS 的版本号，接口的处理时间等等
* [resource](https://github.com/thinkjs/think-resource) 处理静态资源，生产环境建议关闭，直接用 webserver 处理即可。
* [trace](https://github.com/thinkjs/think-trace) 处理报错，开发环境将详细的报错信息显示处理，也可以自定义显示错误页面。
* [payload](https://github.com/thinkjs/think-payload) 处理表单提交和文件上传，类似于 koa-bodyparser 等 middleware
* [router](https://github.com/thinkjs/think-router) 路由解析，包含自定义路由解析
* [logic](https://github.com/thinkjs/think-logic) logic 调用，数据校验
* [controller](https://github.com/thinkjs/think-controller) controller 和 action 调用

### 项目中自定义的 middleware

有时候项目中根据一些特定需要添加 middleware，那么可以放在 `src/middleware` 目录下，然后就可以直接通过字符串的方式引用了。

如：添加了 `src/middleware/csrf.js`，那么就可以直接通过 `csrf` 字符串引用这个 middleware。

```js
module.exports = [
  {
    handle: 'csrf',
    options: {}
  }
]
```


### 引入外部的 middleware

引入外部的 middleware 非常简单，只需要 require 进来即可。注意：引入的 middlware 必须是 Koa@2 的。

```js
const csrf = require('csrf'); 
module.exports = [
  ...,
  {
    handle: csrf,
    options: {}
  },
  ...
]
```

### 常见问题

#### middleware 配置是否需要考虑顺序？

middleaware 执行是安排配置的顺序执行的，所以需要开发者考虑配置单顺序。

#### 怎么看当前环境下哪些 middleware 生效？

可以通过 `DEBUG=koa:application node development.js` 来启动项目，这样控制台下会看到 `koa:application use ...` 相关的信息。

注意：如果启动了多个 worker，那么会打印多遍。
