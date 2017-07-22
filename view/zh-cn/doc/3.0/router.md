## Router / 路由

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

有时候为了搜索引擎优化或者一些其他的原因，URL 上会多加一些东西。比如：当前页面是一个动态页面，为了 SEO，会在 URL 后面加上 `.html` 后缀假装页面是一个静态页面，但 `.html` 对于路由解析来说是无用的，是要去除的。

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
  subdomainOffset: 2, // 域名偏移量
  subdomain: { // 子域名映射详细配置
    'aaa.bbb': 'aaa'
  }
}
```

在做子域名映射时，需要解析出当前域名的子域名具体是什么？这时候就需要用到域名偏移量  `subdomainOffset` 了，该配置默认值为 2， 例如：对于域名 aaa.bbb.example.com， 解析后的子域名列表为 `["aaa", "bbb"]`, 当域名偏移量为 3 时，解析后的子域名列表为 `["aaa"]`，解析后的值保存在 `ctx.subdomains` 属性上。如果当前域名是个 IP，那么解析后的 ctx.subdomains 始终为空数组。

在进行子域名匹配时，会将 `ctx.subdomains` 转为字符串（`join(",")`）然后跟 `subdomain` 配置进行匹配。如果匹配到了 `subdomain` 里的配置，那么会将对应的值前缀补充到 `pathname` 值上。如：当访问 `http://aaa.bbb.example.com/api_lib/inbox/123`，由于配置了 `'aaa.bbb': 'aaa'`, 那么得到的 pathname 将为 `/aaa/api_lib/inbox/123`，匹配顺序为按配置依次向后匹配，如果匹配到了，那么会终止后续的匹配。

如果 `subdomain` 配置是一个数组，那么会自动将数组转化为对象，方便后续进行匹配。

```js
subdomain: ['admin', 'user'] 

// 转化为
subdomain: {
  admin: 'admin', 
  user: 'user'
}
```

### 路由解析

通过 `prefix & suffix` 和 `subdomain` 预处理后，得到真正后续要解析的 `pathname`。默认的路由解析规则为 `/controller/action`，如果是多模块项目，那么规则为 `/module/controller/action`，根据这个规则解析出对应的 `module`、`controller`、`action` 值。

如果 controller 有子级，那么会优先匹配子级 controller，然后再匹配 action。

| pathname  | 项目类型  | 子级控制器  |  module | controller  | action | 备注 |
|---|---|---|---|---|---|---|
| / | 单模块 | 无 | | index | index | controller、action 为配置的默认值 |
| /user | 单模块 | 无 | | user | index | action 为配置的默认值 |
| /user/login | 单模块 | 无 | | user | login |  |
| /console/user/login | 单模块 | 有 | | console/user | login | 有子级控制器 console/user |
| /console/user/login/aaa/bbb | 单模块 | 有 | | console/user | login | 剩余的 aaa/bbb 不再解析 |
| /admin/user | 多模块 | 无 | admin | user | index | 多模块项目，有名为 admin 的模块 |
| /admin/console/user/login | 多模块 | 有 | admin | console/user | login | | | 


解析后的 module、controller、action 分别放在 `ctx.module`、`ctx.controller`、`ctx.action` 上，方便后续调用处理。如果不想要默认的路由解析，那么可以通过配置 `enableDefaultRouter: false` 关闭。

### 自定义路由规则

虽然默认的路由解析方式能够满足需求，但有时候会导致 URL 看起来不够优雅，我们更希望 URL 比较简短，这样会更利于记忆和传播。框架提供了自定义路由来处理这种需求。

自定义路由规则配置文件为 `src/config/router.js`，路由规则为二维数组：

```js
module.exports = [
  [/libs\/(.*)/i, '/libs/:1', 'get'],
  [/fonts\/(.*)/i, '/fonts/:1', 'get,post'],
];
```
每一条路由规则也为一个数组，数组里面的项分别对应为：`match`、`pathname`、`method`、`options`：

* `match` {String | RegExp} pathname 匹配规则，可以是字符串或者正则。如果是字符串，那么会通过 [path-to-regexp](https://github.com/pillarjs/path-to-regexp) 模块转为正则
* `pathname` {String} 匹配后映射后的 pathname，后续会根据这个映射的 pathname 解析出对应的 controller、action
* `method` {String} 该条路由规则支持的请求类型，默认为所有。多个请求类型中间用逗号隔开，如：`get,post`
* `options` {Object} 额外的选项，如：跳转时指定 statusCode

自定义路由在服务启动时读到 `think.app.routers` 对象上，路由的匹配规则为：从前向后逐一匹配，如果命中到了该项规则，则不再向后匹配。

#### 获取 match 中匹配的值

配置规则时，有时候需要在 pathname 中获取 match 中匹配到的值，这时候可以通过字符串匹配或者正则分组来获取。

##### 字符串路由


```js
module.exports = [
  ['/user/:name', 'user']
]
```
字符串匹配的格式为 `:name` 的方式，当匹配到这条路由后，会获取到 `:name` 对应的值，最终转化为对应的参数，以便于后续获取。

对于上面的路由，假如访问的路径为 `/user/thinkjs`，那么 `:name` 匹配到的值为 `thinkjs`，这时会追加个名为 name 的参数，controller 里可以通过 `this.get("name")` 来获取这个参数。

##### 正则路由

```js
module.exports = [
  [\/user\/(\w+)/, 'user?name=:1']
]
```
对于上面的路由，假如访问的路径为 `/user/thinkjs`，那么正则中的分组 `(\w+)` 匹配到的值为 `thinkjs`，这样在第二个参数可以通过 `:1` 来获取这个值。对于正则中有多个分组，那么可以通过 `:1`、`:2`、`:3` 这样来获取对应匹配的值。


#### Redirect

有时候项目经过多次重构后，URL 地址可能会发生一些变化，为了兼容之前的 URL，一般需要把之前的 URL 跳转到新的 URL 上。这里可以通过将 `method` 设置为 `redirect` 来完成。

```js
module.exporst = [
  ['/usersettings', '/user/setting', 'redirect', {statusCode: 301}]
]
```
当访问地址为 `/usersettings` 时会自动跳转到 `/user/setting`，同时指定此次请求的 statusCode 为 301。

#### RESTful

有时候希望提供 RESTful API，这时候也可以借助自定义路由来完成，相关文档请移步到 [RESTful API](/doc/3.0/rest.html)。

### 动态添加自定义路由

有时候我们需要开发一些定制化很高的系统，如：通用的 CMS 系统，这些系统一般都可以配置一些页面的访问规则。这时候一些自定义路由就不能写死了，而是需要把后台配置的规则保存早数据库中，然后动态配置自定义路由规则。

这时候可以借助 `think.beforeStartServer` 方法在服务启动之前从数据库里读到最新的自定义路由规则，然后通过 `routerChange` 事件来处理。

```js
// src/bootstrap/worker.js

think.beforeStartServer(async () => {
  const config = think.model('config');
  const data = await config.where({key: 'router'}).find(); // 将所有的自定义路由保存在字段为 router 的数据上
  const routers = JSON.parse(data.value);
  think.app.emit('routerChange', routers); // 触发 routerChange 事件，将新的自定义路由设置到 think.app.routers 对象上
})

```

### 常见问题

#### 怎么查看当前地址解析后的 controller 和 action 分别对应什么？

解析后的 controller 和 action 分别放在了 `ctx.controller` 和 `ctx.action` 上，有时候我们希望快速知道当前访问的路径最后解析的 controller 和 action 是什么，这时候可以借助 `debug` 来快速看到。

```
DEBUG=think-router npm start
```

[think-router](https://github.com/thinkjs/think-router) 在路由解析时打印了相关的调试信息，通过 `DEBUG=think-router` 来开启，开启后会在控制台下看到如下的调试信息：

```
think-router matchedRule: {"match":{"keys":[]},"path":"console/service/func","method":"GET","options":{},"query":{}} +53ms
think-router RouterParser: path=/console/service/func, module=, controller=console/service, action=func, query={} +0ms
```

`matchedRule` 为命中了哪个自定义路由，`RouterParser` 为解析出来的值。

当然通过 debug 信息也能快速定位后有时候有些自定义路由没能生效的问题。

#### 如何优化自定义路由匹配性能？

由于自定义路由是从前往后依次匹配的，直到规则命中才停止往后继续匹配，如果规则很靠后的话就需要把前面的规则都走一遍，这样可能会有点慢。这时候可以结合每个接口的流量情况，把重要的路由放在前面，不重要的路由放在后面来提升性能。

#### 正则路由建议

对于正则路由，默认并不是严格匹配，这样可能会有正则性能问题，同时可能会容易对其他的路由产生影响，这时候可以通过 `^` 和 `$` 进行严格匹配。

```js
module.exports = [
  [/^\/user$/, 'user']
]
```
对于上面的路由，只有访问地址为 `/user` 时才会命中该条规则，这样可以减少对其他路由的影响。如果去掉 `^` 和 `$`，那么访问 `/console/user/thinkjs` 也会命中上面的路由，实际上我们可能写了其他的路由来匹配这个地址，但被这条规则提前命中了，这样给开发带来了一些困难。

#### 能使用第三方的路由解析器么？

框架默认的路由解析是通过 [think-router](https://github.com/thinkjs/think-router) 来完成的，如果想替换为第三方的路由解析器，那么可以将 `src/config/middleware.js` 里的路由配置替换为对应的模块，然后将解析后的 module、controller、action 值保存在 `ctx` 对象上，以便后续的中间件处理。

```js
// 第三方路由解析模块示例，具体代码可以参考 https://github.com/thinkjs/think-router
module.exports = (options, app) => {
  return (ctx, next) => {
    const routers = app.routers; // 拿到所有的自定义路由配置
    ... 
    ctx.module = ''; // 将解析后的 module、controller、action 保存在 ctx 上
    ctx.controller = '';
    ctx.action = '';
    return next();
  }
}
```