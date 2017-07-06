## 路由

当用户访问一个 URL 时，最终执行哪个模块（module）下哪个控制器（controller）的哪个操作（action），这是路由模块解析后决定的。除了默认的解析外，ThinkJS 提供了一套灵活的路由机制，让 URL 更加简单友好。路由在 ThinkJS 中是以中间件（middleware）的形式存在的。

### 路由参数配置

在路由中间件配置文件中可以针对路由进行基础的参数配置。单模块下，配置文件 `src/config/middleware.js`：

```js
const router = require('think-router');
module.exports = [
  {
    handle: router,
    options: {
      prefix: 'home',               // 多模块下，默认的模块名
      defaultController: 'index',   // 默认的控制器名
      defaultAction: 'index',       // 默认的操作名
      prefix: [],                   // 默认去除的 url 前缀
      suffix: ['.html'],            // 默认去除的 url 后缀
      enableDefaultRouter: true,    // 在不匹配情况下是否使用默认路由
      subdomainOffset: 2,           // 子域名偏移
      subdomain: {},                // 子域名映射
      denyModules: []               // 多模块下，禁止访问的模块
    }
  }
];
```

### pathname 预处理

当用户访问服务时，服务端首先拿到的是一个完整的 URL，如：访问本页面，得到的 URL 为 `http://www.thinkjs.org/zh-cn/doc/3.0/router.html`，我们得到的初始 `pathname` 为 `/zh-cn/doc/3.0/router.html`。

有时候为了搜索引擎优化或者一些其他的原因， URL 上会多加一些东西。比如：当前页面是一个动态页面，我们在 URL 最后加了 .html，这样对搜索引擎更加友好，但这在后续的路由解析中是无用的。

ThinkJS 里提供了下面的配置可以去除 `pathname` 的某些前缀和后缀。在路由中间件配置文件中：

```js
{
  prefix: [],
  suffix: ['.html'],
  // 其他配置...
}
```

`prefix` 与 `subffix` 为数组，数组的每一项可以为字符串或者正则表达式， 在匹配到第一个之后停止后续匹配。对于上述 `pathname` 在默认配置下进行过滤后，拿到纯净的 pathname 为 `/zh-cn/doc/3.0/router`。

如果访问的 URL 是 `http://www.thinkjs.org/`，那么最后拿到纯净的 `pathname` 则为字符串 `/`。

### 路由规则

单模块路由规则配置文件 `src/config/router.js`，路由规则为二维数组：

```js
module.exports = [
  [/libs\/(.*)/i, '/libs/:1', 'get'],
  [/fonts\/(.*)/i, '/fonts/:1', 'get,post'],
];
```

路由的匹配规则为：从前向后逐一匹配，如果命中到了该项规则，则不再向后匹配。 对于每一条匹配规则，参数为：

```js
[
  match,      // url 匹配规则, 预先使用 path-to-regexp 转换
  path,       // 对应的操作（action）的路径
  method,     // 允许匹配的请求类型，多个请求类型之间逗号分隔，get|post|redirect|rest|cli
  [options]   // 额外参数，如 method=redirect时，指定跳转码 {statusCode: 301}
]
```

### 路由解析

对于匹配规则中的 `match` 会使用 [path-to-regexp](https://github.com/pillarjs/path-to-regexp) 预先转换：

```js
module.exports = [
  ['/api_libs/(.*)/:id', '/libs/:1/', 'get'],
]
```

对于 `match` 中的 `:c`(c 为字符串)，在 `match` 匹配 `pathname` 之后获取到 `c` 的值，`c` 的值会被附加到 `this.ctx`； `path` 可以引用 `match` 匹配 `pathname` 之后的结果，对于 `path` 中的 `:n`(n 为数字)， 会被 `match` 匹配 `pathname` 的第 n 个引用结果替换。

路由识别默认根据 `[模块]/控制器/操作/...` 来识别过滤后的 `pathname`，从而对应到最终要执行的操作(action)。

例如，对于上述规则，在访问 URL `http:/www.thinkjs.org/api_libs/inbox/123` 时，规则的 `path` 将变为 `/libs/inbox/`, 同时`{id: '123'}` 会附加到 `this.ctx` 上。之后对 `pathname` 进行解析，就对应到了 `libs` 控制器（controller）下的 `inbox` 操作（action）。在 `inboxAction` 下可以通过 `this.ctx.param('id')` 获取到 `id` 的值 `123`。

### 子域名部署

当项目比较复杂时，可能希望将不同的功能部署在不同的域名下，但代码还是在一个项目下。ThinkJS 提供子域名来处理这个需求，在路由中间件配置文件中：

```js
{
  subdomainOffset: 2,
  prefix: [],
  suffix: ['.html'],
  subdomain: {
    'news,zm': 'news'
  },
  // 其他配置...
}
```

域名偏移(subdomainOffset) 默认为 2， 例如对于域名 zm.news.so.com， `this.ctx.subdomains` 为 `['news', 'zm']`, 当域名偏移为 3 时，`this.ctx.subdomains` 为 `['zm']`。

如果路由中间件配置的 `subdomain` 项中存在 `this.ctx.subdomains.join(,)` 对应的 key，此 key 对应的值将会被附加到 `pathname` 上，然后再进行路由的解析。

对于上述配置，当我们访问 `http://zm.news.so.com:8360/api_lib/inbox/123`，我们得到的 `pathname` 将为 `/news/api_lib/inbox/123`。

另外 `subdomain` 的配置也可以为一个数组，我们会将数组转化为对象。例如 `subdomain: ['admin', 'user']`将会被转化为 `subdomain: {admin: 'admin', user: 'user'}`。
