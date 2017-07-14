## Router

当用户访问一个地址时，需要有一个对应的逻辑进行处理。传统的处理方式下，一个请求对应的一个文件，如访问时 `/user/about.php`，那么就会在项目对应的目录下有 `/user/about.php` 这个实体文件。这种方式虽然能解决问题，但会导致文件很多，同时可能很多文件里逻辑功能其实比较简单。

在现在的 MVC 开发模型里，一般都是通过路由来解决此类问题。解决方式为：先将用户的所有请求映射到一个入口文件（如：`index.php`），然后框架解析当前请求的地址，根据配置或者约定解析出对应要执行的功能，最后去调用然后响应用户的请求。

由于 Node.js 是自己启动 HTTP(S) 服务的，所以已经天然将用户的请求汇总到一个入口了，这样处理路由映射就更简单了。

在 ThinkJS 中，当用户访问一个 URL 时，最后是通过 controller 里具体的 action 来响应的。所以就需要解析出 URL 对应的 controller 和 action，这个解析工作是通过 [think-router](https://github.com/thinkjs/think-router) 模块实现的。

### 路由配置

`think-router` 是一个 middleware，项目创建时默认已经加到配置文件 `src/config/middleware.js` 里了，其中 `options` 支持如下的参数：

* `defaultModule` {String} 多模块项目下，默认的模块名。默认值为 `home`
* `defaultController` {String} 默认的控制器名，默认值为 `index`
* `defaultAction` {String} 默认的操作名，默认值为 `index`
* `prefix` {Array} 默认去除的 pathname 前缀，默认值为 `[]`
* `suffix` {Array} 默认去除的 pathname 后缀，默认值为 `['.html']`
* `enableDefaultRouter` {Boolean} 在不匹配情况下是否使用默认路由解析，默认值为 `true`
* `subdomainOffset` {Number} 子域名映射下的偏移量，默认值为 `2`
* `subdomain` {Object|Array} 子域名映射列表，默认为 `{}`
* `denyModules` {Array} 多模块项目下，禁止访问的模块列表，默认为 `[]`

具体的默认配置如下，项目中可以根据需要进行修改：

```js
module.exports = [
  {
    handle: 'router',
    options: {
      defaultModule: 'home',        
      defaultController: 'index',   
      defaultAction: 'index',       
      prefix: [],                   
      suffix: ['.html'],            
      enableDefaultRouter: true,   
      subdomainOffset: 2,         
      subdomain: {},               
      denyModules: []             
    }
  }
];
```

### 路径预处理

当用户访问服务时，通过 `ctx.url` 属性，可以得到初始的 `pathname`，如：访问本页面 `https://www.thinkjs.org/zh-cn/doc/3.0/router.html`，初始 pathname 为 `/zh-cn/doc/3.0/router.html`。

为了方便后续通过 pathname 解析出对应的 controller 和 action，需要对 pathname 进行预处理。

#### prefix & suffix

有时候为了搜索引擎优化或者一些其他的原因，URL 上会多加一些东西。比如：当前页面是一个动态页面，为了 SEO，会在 URL 后面加上 `.html` 后缀假装当前页面是一个静态页面，但 `.html` 对于路由解析来说是无用的，是要去除的。

这时候可以通过 `prefix` 和 `suffix` 配置来去除一些前置或者后置的特定值，如：

```js
{
  prefix: [],
  suffix: ['.html'],
}
```

`prefix` 与 `subffix` 为数组，数组的每一项可以为字符串或者正则表达式， 在匹配到第一个之后停止后续匹配。对于上述 `pathname` 在默认配置下进行过滤后，拿到纯净的 pathname 为 `/zh-cn/doc/3.0/router`。

如果访问的 URL 是 `http://www.thinkjs.org/`，那么最后拿到纯净的 `pathname` 则为字符串 `/`。

#### 子域名映射

当项目比较复杂时，可能希望将不同的功能部署在不同的域名下，但代码还是在一个项目下，这时候可以通过子域名映射来完成：

```js
{
  subdomainOffset: 2,
  subdomain: {
    'aaa.bbb': 'aaa'
  }
}
```

域名偏移 `subdomainOffset` 默认为 2， 例如对于域名 aaa.bbb.example.com， `this.ctx.subdomains` 为 `['news', 'zm']`, 当域名偏移为 3 时，`this.ctx.subdomains` 为 `['zm']`。

如果路由中间件配置的 `subdomain` 项中存在 `this.ctx.subdomains.join(,)` 对应的 key，此 key 对应的值将会被附加到 `pathname` 上，然后再进行路由的解析。

对于上述配置，当我们访问 `http://zm.news.so.com:8360/api_lib/inbox/123`，我们得到的 `pathname` 将为 `/news/api_lib/inbox/123`。

另外 `subdomain` 的配置也可以为一个数组，我们会将数组转化为对象。例如 `subdomain: ['admin', 'user']`将会被转化为 `subdomain: {admin: 'admin', user: 'user'}`。



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



### 常见问题

#### 怎么查看当前地址解析后的 controller 和 action 分别对应什么？

