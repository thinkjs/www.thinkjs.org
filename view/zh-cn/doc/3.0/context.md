## Context

Context 是 Koa 中处理用户请求中的一个对象，贯穿整个请求生命周期。一般在 middleware、controller、logic 中使用，简称为 `ctx`。

```js
// 在 middleware 中使用 ctx 对象
module.exports = options => {
  // 调用时 ctx 会作为第一个参数传递进来
  return (ctx, next) => {
    ... 
  }
}
```

```js
// 在 controller 中使用 ctx 对象
module.exports = class extends think.Controller {
  indexAction() {
    // controller 中 ctx 作为类的属性存在，属性名为 ctx
    // controller 实例化时会自动把 ctx 传递进来
    const ip = this.ctx.ip; 
  }
}
```

框架里继承了该对象，并通过 Extend 机制扩展了很多非常有用的属性和方法。

### Koa 内置 API
#### req

Node 的 [request](https://nodejs.org/api/http.html#http_class_http_incomingmessage) 对象。

#### res

Node 的 [response](https://nodejs.org/api/http.html#http_class_http_serverresponse) 对象。

**不支持** 绕开 Koa 对 response 的处理。 避免使用如下 node 属性:

- `res.statusCode`
- `res.writeHead()`
- `res.write()`
- `res.end()`

#### request

Koa 的 [Request](http://koajs.com/#request) 对象。

#### response

Koa 的 [Response](http://koajs.com/#response) 对象。

#### state

在中间件之间传递信息以及将信息发送给模板时，推荐的命名空间。避免直接在 ctx 上加属性，这样可能会覆盖掉已有的属性，导致出现奇怪的问题。

```js
ctx.state.user = await User.find(id);
```

这样后续在 controller 里可以通过 `this.ctx.state.user` 来获取对应的值。

```js
module.exports = class extends think.Controller {
  indexAction() {
    const user = this.ctx.state.user;
  }
}
```

#### app

应用实例引用，等同于 `think.app`。

#### cookies.get(name, [options])

获取 cookie，不建议使用，推荐 `ctx.cookie(name)`

#### cookies.set(name, value, [options])

设置 cookie，不建议使用，推荐 `ctx.cookie(name, value, options)`

#### throw([msg], [status], [properties])

辅助方法，抛出包含 `.status` 属性的错误，默认为 `500`。该方法让 Koa 能够根据实际情况响应。并且支持如下组合：

```javascript
this.throw(403)
this.throw('name required', 400)
this.throw(400, 'name required')
this.throw('something exploded')
```

例如 `this.throw('name required', 400)` 等价于：

```javascript
var err = new Error('name required');
err.status = 400;
throw err;
```

注意，这些是用户级别的错误，被标记了 `err.expose`，即这些消息可以用于响应客户端。显然，当你不想泄露失败细节的时候，不能用它来传递错误消息。

你可以传递一个 `properties` 对象，该对象会被合并到 error 中，有助于修改传递给上游中间件的机器友好的错误。

```javascript
this.throw(401, 'access_denied', { user: user });
this.throw('access_denied', { user: user });
```

Koa 使用 [http-errors](https://github.com/jshttp/http-errors) 创建错误对象。

#### assert(value, [msg], [status], [properties])

当 `!value`为真时抛出错误的辅助方法，与 `.throw()` 相似。类似于 node 的 [assert()](http://nodejs.org/api/assert.html) 方法。

```
this.assert(this.user, 401, 'User not found. Please login!');
```

Koa 使用 [http-assert](https://github.com/jshttp/http-assert) 实现断言.

#### respond

如不想使用 Koa 内置的 response 处理方法，可以设置 `ctx.respond = false;`。这时你可以自己设置原始的 `res` 对象来处理响应。

注意这样使用是 __不__被 Koa 支持的。因为这样有可能会破坏 Koa 的中间件和 Koa 本身提供的功能。这种用法只是作为一种 hack ，给那些想要在Koa中使用传统的`fn(req, res)`的方法和中间件的人提供一种便捷方式。

#### Request 别名

下面的访问器和别名同 [Request](http://koa.rednode.cn/#request) 等价：

- `ctx.header`
- `ctx.headers`
- `ctx.method`
- `ctx.method=`
- `ctx.url`
- `ctx.url=`
- `ctx.originalUrl`
- `ctx.origin`
- `ctx.href`
- `ctx.path`
- `ctx.path=`
- `ctx.query`
- `ctx.query=`
- `ctx.querystring`
- `ctx.querystring=`
- `ctx.host`
- `ctx.hostname`
- `ctx.fresh`
- `ctx.stale`
- `ctx.socket`
- `ctx.protocol`
- `ctx.secure`
- `ctx.ip`
- `ctx.ips`
- `ctx.subdomains`
- `ctx.is()`
- `ctx.accepts()`
- `ctx.acceptsEncodings()`
- `ctx.acceptsCharsets()`
- `ctx.acceptsLanguages()`
- `ctx.get()`

#### Response 别名

下面的访问器和别名同 [Response](http://koa.rednode.cn/#response) 等价:

- `ctx.body`
- `ctx.body=`
- `ctx.status`
- `ctx.status=`
- `ctx.message`
- `ctx.message=`
- `ctx.length=`
- `ctx.length`
- `ctx.type=`
- `ctx.type`
- `ctx.headerSent`
- `ctx.redirect()`
- `ctx.attachment()`
- `ctx.set()`
- `ctx.append()`
- `ctx.remove()`
- `ctx.lastModified=`
- `ctx.etag=`

### 框架扩展 API

#### module

路由解析后的模块名，单模块项目下该属性值始终为空。默认是通过 [think-router](https://github.com/thinkjs/think-router) 模块解析。

```js
module.exports = class extends think.Controller {
  __before() {
    // 获取解析后的 module
    // 由于 module 已经被 node 使用，所以这里建议变量名不要为 module
    const m = this.ctx.module;
  }
}
```

#### controller

路由解析后的控制器名，默认是通过 [think-router](https://github.com/thinkjs/think-router) 模块解析。

```js
module.exports = class extends think.Controller {
  __before() {
    // 获取解析后的 controller
    const controller = this.ctx.controller;
  }
}
```

#### action

路由解析后的操作名，默认是通过 [think-router](https://github.com/thinkjs/think-router) 模块解析。

```js
module.exports = class extends think.Controller {
  __before() {
    // 获取解析后的 action
    const action = this.ctx.action;
  }
}
```

#### userAgent

可以通过 `ctx.userAgent` 属性获取用户的 userAgent。

```js
const userAgent = ctx.userAgent;
if(userAgent.indexOf('spider')){
  ...
}
```

#### isGet

可以通过 `ctx.isGet` 判断当前请求类型是否是 `GET`。

```
const isGet = ctx.isGet;
if(isGet){
  ...
}
```

#### isPost

可以通过 `ctx.isPost` 判断当前请求类型是否是 `POST`。

```
const isPost = ctx.isPost;
if(isPost){
  ...
}
```

#### isCli

可以通过 `ctx.isCli` 判断当前请求类型是否是 `CLI`（命令行调用）。

```
const isCli = ctx.isCli;
if(isCli){
  ...
}
```

#### referer(onlyHost)

* `onlyHost` {Boolean} 是否只返回 host
* `return` {String}

获取请求的 referer。

```
const referer1 = ctx.referer(); // http://www.thinkjs.org/doc.html
const referer2 = ctx.referer(true); // www.thinkjs.org
```

#### referrer(onlyHost)

等同于 `referer` 方法。

#### isMethod(method)

* `method` {String} 请求类型
* `return` {Boolean}

判断当前请求类型与 method 是否相同。

```
const isPut = ctx.isMethod('PUT');
```

#### isAjax(method)

* `method` {String} 请求类型
* `return` {Boolean}

判断是否是 ajax 请求（通过 header 中 `x-requested-with` 值是否为 `XMLHttpRequest` 判断），如果执行了 method，那么也会判断请求类型是否一致。

```
const isAjax = ctx.isAjax();
const isPostAjax = ctx.isAjax('POST');
```

#### isJsonp(callbackField)

* `callbackField` {String} callback 字段名，默认值为 `this.config('jsonpCallbackField')`
* `return` {Boolean}

判断是否是 jsonp 请求。

```
const isJsonp = ctx.isJson('callback');
if(isJsonp){
  ctx.jsonp(data);
}
```

#### jsonp(data, callbackField)

* `data` {Mixed} 要输出的数据
* `callbackField` {String} callback 字段名，默认值为 `this.config('jsonpCallbackField')`
* `return` {Boolean} false

输出 jsonp 格式的数据，返回值为 false。可以通过配置 `jsonContentType` 指定返回的 `Content-Type`。

```
ctx.jsonp({name: 'test'});

//output
jsonp111({
  name: 'test'
})
```

#### json(data)

* `data` {Mixed} 要输出的数据
* `return` {Boolean} false

输出 json 格式的数据，返回值为 false。可以通过配置 `jsonContentType` 指定返回的 `Content-Type`。

```
ctx.json({name: 'test'});

//output
{
  name: 'test'
}
```

#### success(data, message)

* `data` {Mixed} 要输出的数据
* `message` {String} errmsg 字段的数据
* `return` {Boolean} false

输出带有 `errno` 和 `errmsg` 格式的数据。其中 `errno` 值为 0，`errmsg` 值为 message。

```js
{
  errno: 0,
  errmsg: '',
  data: ...
}
```

字段名 `errno` 和 `errmsg` 可以通过配置 `errnoField` 和 `errmsgField` 来修改。

#### fail(errno, errmsg, data)

* `errno` {Number} 错误号
* `errmsg` {String} 错误信息
* `data` {Mixed} 额外的错误数据
* `return` {Boolean} false

```js
{
  errno: 1000,
  errmsg: 'no permission',
  data: ''
}
```

字段名 `errno` 和 `errmsg` 可以通过配置 `errnoField` 和 `errmsgField` 来修改。

#### expires(time)

* `time` {Number} 缓存的时间，单位是毫秒。可以 `1s`，`1m` 这样的时间
* `return` {undefined}

设置 `Cache-Control` 和 `Expires` 缓存头。

```
ctx.expires('1h'); //缓存一小时
```

#### config(name, value, m)

* `name` {Mixed} 配置名
* `value` {Mixed} 配置值
* `m` {String} 模块名，多模块项目下生效
* `return` {Mixed} 

获取、设置配置项。内部调用 `think.config` 方法。

```
ctx.config('name'); //获取配置
ctx.config('name', value); //设置配置值
ctx.config('name', undefined, 'admin'); //获取 admin 模块下配置值，多模块项目下生效
```

#### param(name, value)

* `name` {String} 参数名
* `value` {Mixed} 参数值
* `return` {Mixed}

获取、设置 URL 上的参数值。由于 `get`、`query` 等名称已经被 Koa 使用，所以这里只能使用 param。

```
ctx.param('name'); //获取参数值，如果不存在则返回 undefined
ctx.param(); //获取所有的参数值，包含动态添加的参数
ctx.param('name1,name2'); //获取指定的多个参数值，中间用逗号隔开
ctx.param('name', value); //重新设置参数值
ctx.param({name: 'value', name2: 'value2'}); //重新设置多个参数值
```

#### post(name, value)

* `name` {String} 参数名
* `value` {Mixed} 参数值
* `return` {Mixed}

获取、设置 POST 数据。

```
ctx.post('name'); //获取 POST 值，如果不存在则返回 undefined
ctx.post(); //获取所有的 POST 值，包含动态添加的数据
ctx.post('name1,name2'); //获取指定的多个 POST 值，中间用逗号隔开
ctx.post('name', value); //重新设置 POST 值
ctx.post({name: 'value', name2: 'value2'}); //重新设置多个 POST 值
```

#### file(name, value)

* `name` {String} 参数名
* `value` {Mixed} 参数值
* `return` {Mixed}

获取、设置文件数据。

```
ctx.file('name'); //获取 FILE 值，如果不存在则返回 undefined
ctx.file(); //获取所有的 FILE 值，包含动态添加的数据
ctx.file('name', value); //重新设置 FILE 值
ctx.file({name: 'value', name2: 'value2'}); //重新设置多个 FILE 值
```

文件的数据格式为：

```
{
  "size": 287313, //文件大小
  "path": "/var/folders/4j/g57qvmmd1lb_9h605w_d38_r0000gn/T/upload_fa6bf8c44179851f1cfec99544b4ef22", //临时存放的位置
  "name": "An Introduction to libuv.pdf", //文件名
  "type": "application/pdf", //类型
  "mtime": "2017-07-02T07:55:23.763Z" //最后修改时间
}
```

#### cookie(name, value, options)

* `name` {String} Cookie 名
* `value` {mixed} Cookie 值
* `options` {Object} Cookie 配置项
* `return` {Mixed}

获取、设置 Cookie 值。

```
ctx.cookie('name'); //获取 Cookie
ctx.cookie('name', value); //设置 Cookie
ctx.cookie(name, null); //删除 Cookie
```

设置 Cookie 时，如果 value 的长度大于 4094，则触发 `cookieLimit` 事件，该事件可以通过 `think.app.on("cookieLimit")` 来捕获。

#### controller(name, m)
* `name` {String} 要调用的 controller 名称
* `m` {String} 模块名，多模块项目下生效
* `return` {Object} Class Instance

获取另一个 Controller 的实例，底层调用 `think.controller` 方法。

```
//获取 src/controller/user.js 的实例
const controller = ctx.controller('user');
```

#### service(name, m)

* `name` {String} 要调用的 service 名称
* `m` {String} 模块名，多模块项目下生效
* `return` {Mixed}

获取 service，这里获取到 service 后并不会实例化。

```
// 获取 src/service/github.js 模块
const github = ctx.service('github');
```
