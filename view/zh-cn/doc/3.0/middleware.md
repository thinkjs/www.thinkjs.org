## Middleware / 中间件

Middleware 称之为中间件，是 Koa 中一个非常重要的概念，利用中间件，可以很方便的处理用户的请求。由于 ThinkJS 3.0 是基于 Koa@2 版本之上构建的，所以完全兼容 Koa 里的中间件。


### 中间件格式

```js
module.exports = options => {
  return (ctx, next) => {
    // do something
  }
}
```
中间件格式为一个高阶函数，外部的函数接收一个 `options` 参数，这样方便中间件提供一些配置信息，用来开启/关闭一些功能。执行后返回另一个函数，这个函数接收 `ctx`, `next` 参数，其中 `ctx` 为 `context` 的简写，是当前请求生命周期的一个对象，存储了当前请求的一些相关信息，`next` 为调用后续的中间件，返回值是 Promise，这样可以很方便的处理后置逻辑。

整个中间件执行过程是个洋葱模型，类似下面这张图：

![](https://p0.ssl.qhimg.com/t014260f4c3e6e64daa.png)

假如要实现一个打印当前请求执行时间的 middleware，可以用类似下面的方式：

```js
const defaultOptions = {
  consoleExecTime: true // 是否打印执行时间的配置
}
module.exports = (options = {}) => {
  options = Object.assign({}, defaultOptions, options);
  return (ctx, next) => {
    if(!options.consoleExecTime) {
      return next(); // 如果不需要打印执行时间，直接调用后续执行逻辑
    }
    const startTime = Date.now();
    let err = null;
    // 调用 next 统计后续执行逻辑的所有时间
    return next().catch(e => {
      err = e; // 这里先将错误保存在一个错误对象上，方便统计出错情况下的执行时间
    }).then(() => {
      const endTime = Date.now();
      console.log(`request exec time: ${endTime - startTime}ms`);
      if(err) return Promise.reject(err); // 如果后续执行逻辑有错误，则将错误返回
    })
  }
}
```


在 Koa 中，可以通过调用 `app.use` 的方式来使用中间件，如：

```js
const app = new Koa();
const execTime = require('koa-execTime'); // 引入统计执行时间的模块
app.use(execTime({}));  // 需要将这个中间件第一个注册，如果还有其他中间件放在后面注册
```

通过 `app.use` 的方式使用中间件，不利于中间件的统一维护。为了方便管理和使用中间件，框架使用统一的配置文件来管理中间件，配置文件为 `src/config/middleware.js`。

### 配置格式

```js
const path = require('path')
const isDev = think.env === 'development'

module.exports = [
  {
    handle: 'meta', // 中间件处理函数
    options: {   // 当前中间件需要的配置
      logRequest: isDev,
      sendResponseTime: isDev,
    },
  },
  {
    handle: 'resource',
    enable: isDev, // 是否开启当前中间件
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/,
    },
  }
]
```

配置项为项目中要使用的中间件列表，每一项支持 `handle`，`enable`，`options`，`match` 等属性。

#### handle

中间件的处理函数，可以用系统内置的，也可以是引入外部的，也可以是项目里的中间件。

handle 的函数格式为：

```js
module.exports = (options, app) => {
  return (ctx, next) => {

  }
}
```

这里中间件接收的参数除了 options 外，还多了个 `app` 对象，该对象为 Koa Application 的实例。

#### enable

是否开启当前的中间件，比如：某个中间件只在开发环境下才生效。

```js
{
  handle: 'resouce',
  enable: think.env === 'development' //这个中间件只在开发环境下生效
}
```

#### options

传递给中间件的配置项，格式为一个对象。

```js
module.exports = [
  {
    options: {} 
  }
]
```

#### match

匹配特定的规则后才执行该中间件，支持二种方式，一种是路径匹配，一种是自定义函数匹配。如：

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

### 框架内置的中间件

框架内置了几个中间件，可以通过字符串的方式直接引用。

```js
module.exports = [
  {
    handle: 'meta', // 内置的中间件不用手工 require 进来，直接通过字符串的方式引用
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

### 项目中自定义的中间件

有时候项目中根据一些特定需要添加中间件，那么可以放在 `src/middleware` 目录下，然后就可以直接通过字符串的方式引用了。

如：添加了 `src/middleware/csrf.js`，那么就可以直接通过 `csrf` 字符串引用这个中间件。

```js
module.exports = [
  {
    handle: 'csrf',
    options: {}
  }
]
```


### 引入外部的中间件

引入外部的中间件非常简单，只需要 require 进来即可。

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

#### 中间件配置是否需要考虑顺序？

中间件执行是按照配置的排列顺序执行的，所以需要开发者考虑配置的顺序。

#### 怎么看当前环境下哪些中间件生效？

可以通过 `DEBUG=koa:application node development.js` 来启动项目，这样控制台下会看到 `koa:application use ...` 相关的信息。

注意：如果启动了多个 worker，那么会打印多遍。
