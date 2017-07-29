## Context / 上下文

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

#### ctx.req

Node 的 [request](https://nodejs.org/api/http.html#http_class_http_incomingmessage) 对象。

#### ctx.res

Node 的 [response](https://nodejs.org/api/http.html#http_class_http_serverresponse) 对象。

**不支持** 绕开 Koa 对 response 的处理。 避免使用如下 node 属性:

- `res.statusCode`
- `res.writeHead()`
- `res.write()`
- `res.end()`

#### ctx.request

Koa 的 [Request](http://koajs.com/#request) 对象。

#### ctx.response

Koa 的 [Response](http://koajs.com/#response) 对象。

#### ctx.state

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

#### ctx.app

应用实例引用，等同于 `think.app`。

#### ~~ctx.cookies.get(name, [options])~~

获取 cookie，不建议使用，推荐 [ctx.cookie(name)](#toc-a67)

#### ~~ctx.cookies.set(name, value, [options])~~

设置 cookie，不建议使用，推荐 [ctx.cookie(name, value, options)](#toc-a67)

#### ctx.throw([msg], [status], [properties])

辅助方法，抛出包含 `.status` 属性的错误，默认为 `500`。该方法让 Koa 能够根据实际情况响应。并且支持如下组合：

```js
ctx.throw(403)
ctx.throw('name required', 400)
ctx.throw(400, 'name required')
ctx.throw('something exploded')
```

例如 `this.throw('name required', 400)` 等价于：

```js
var err = new Error('name required');
err.status = 400;
throw err;
```

注意，这些是用户级别的错误，被标记了 `err.expose`，即这些消息可以用于响应客户端。显然，当你不想泄露失败细节的时候，不能用它来传递错误消息。

你可以传递一个 `properties` 对象，该对象会被合并到 error 中，有助于修改传递给上游中间件的机器友好的错误。

```js
ctx.throw(401, 'access_denied', { user: user });
ctx.throw('access_denied', { user: user });
```

Koa 使用 [http-errors](https://github.com/jshttp/http-errors) 创建错误对象。

#### ctx.assert(value, [msg], [status], [properties])

当 `!value`为真时抛出错误的辅助方法，与 `.throw()` 相似。类似于 node 的 [assert()](http://nodejs.org/api/assert.html) 方法。

```
this.assert(this.user, 401, 'User not found. Please login!');
```

Koa 使用 [http-assert](https://github.com/jshttp/http-assert) 实现断言.

#### ctx.respond

如不想使用 Koa 内置的 response 处理方法，可以设置 `ctx.respond = false;`。这时你可以自己设置原始的 `res` 对象来处理响应。

注意这样使用是 __不__被 Koa 支持的，因为这样有可能会破坏 Koa 的中间件和 Koa 本身提供的功能。这种用法只是作为一种 hack ，给那些想要在Koa中使用传统的`fn(req, res)`的方法和中间件的人提供一种便捷方式。

#### ctx.header

获取所有的 header 信息，等同于 `ctx.request.header`。

```js
const headers = ctx.headers;
```

#### ctx.headers

获取所有的 header 信息，等同于 `ctx.header`。

#### ctx.method

获取请求类型，大写。如：`GET`、`POST`、`DELETE`。

```js
const method = ctx.method;
```

#### ctx.method=

设置请求类型（并不会修改当前 HTTP 请求的真实类型），对有些中间件的场景下可能有用，如：`methodOverride()`。

```js
ctx.method = 'COMMAND';
```

#### ctx.url

获取请求地址。

#### ctx.url=

设置请求地址，对 URL rewrite 有用。

#### ctx.originalUrl

获取原始的请求 URL

#### ctx.origin

Get origin of URL, include protocol and host.

```js
ctx.origin
// => http://example.com
```


#### ctx.href

Get full request URL, include protocol, host and url.

```js
ctx.href
// => http://example.com/foo/bar?q=1
```

#### ctx.path

Get request pathname.

#### ctx.path=

Set request pathname and retain query-string when present.

#### ctx.query

Get parsed query-string, returning an empty object when no query-string is present. Note that this getter does not support nested parsing.

For example "color=blue&size=small":

```js
{
  color: 'blue',
  size: 'small'
}
```
#### ctx.query=

Set query-string to the given object. Note that this setter does not support nested objects.

```js
ctx.query = { next: '/login' }
```
#### ctx.querystring

Get raw query string void of ?.

#### ctx.querystring=

Set raw query string.

#### ctx.search

Get raw query string with the ?.

#### ctx.search=

Set raw query string.

#### ctx.host

Get host (hostname:port) when present. Supports X-Forwarded-Host when app.proxy is true, otherwise Host is used.

#### ctx.hostname

Get hostname when present. Supports X-Forwarded-Host when app.proxy is true, otherwise Host is used.

#### ctx.type

Get request Content-Type void of parameters such as "charset".

```js
const ct = ctx.type
// => "image/png"
```

#### ctx.charset

Get request charset when present, or undefined:

```js
ctx.charset
// => "utf-8"
```
#### ctx.fresh

Check if a request cache is "fresh", aka the contents have not changed. This method is for cache negotiation between If-None-Match / ETag, and If-Modified-Since and Last-Modified. It should be referenced after setting one or more of these response headers.

```js
// freshness check requires status 20x or 304
ctx.status = 200;
ctx.set('ETag', '123');

// cache is ok
if (ctx.fresh) {
  ctx.status = 304;
  return;
}

// cache is stale
// fetch new data
ctx.body = await db.find('something');
```
#### ctx.stale

Inverse of ctx.fresh.

#### ctx.socket

Return the request socket.

#### ctx.protocol

Return request protocol, "https" or "http". Supports X-Forwarded-Proto when app.proxy is true.


#### ctx.secure

Shorthand for ctx.protocol == "https" to check if a request was issued via TLS.


#### ctx.ip

Request remote address. Supports X-Forwarded-For when app.proxy is true.


#### ctx.ips

When X-Forwarded-For is present and app.proxy is enabled an array of these ips is returned, ordered from upstream -> downstream. When disabled an empty array is returned.


#### ctx.subdomains

Return subdomains as an array.

Subdomains are the dot-separated parts of the host before the main domain of the app. By default, the domain of the app is assumed to be the last two parts of the host. This can be changed by setting app.subdomainOffset.

For example, if the domain is "tobi.ferrets.example.com": If app.subdomainOffset is not set, ctx.subdomains is ["ferrets", "tobi"]. If app.subdomainOffset is 3, ctx.subdomains is ["tobi"].


#### ctx.is(...types)

Check if the incoming request contains the "Content-Type" header field, and it contains any of the give mime types. If there is no request body, null is returned. If there is no content type, or the match fails false is returned. Otherwise, it returns the matching content-type.

```js
// With Content-Type: text/html; charset=utf-8
ctx.is('html'); // => 'html'
ctx.is('text/html'); // => 'text/html'
ctx.is('text/*', 'text/html'); // => 'text/html'

// When Content-Type is application/json
ctx.is('json', 'urlencoded'); // => 'json'
ctx.is('application/json'); // => 'application/json'
ctx.is('html', 'application/*'); // => 'application/json'

ctx.is('html'); // => false
```

For example if you want to ensure that only images are sent to a given route:

```js
if (ctx.is('image/*')) {
  // process
} else {
  ctx.throw(415, 'images only!');
}
```
#### ctx.accepts(types)

Check if the given type(s) is acceptable, returning the best match when true, otherwise false. The type value may be one or more mime type string such as "application/json", the extension name such as "json", or an array ["json", "html", "text/plain"].

```js
// Accept: text/html
ctx.accepts('html');
// => "html"

// Accept: text/*, application/json
ctx.accepts('html');
// => "html"
ctx.accepts('text/html');
// => "text/html"
ctx.accepts('json', 'text');
// => "json"
ctx.accepts('application/json');
// => "application/json"

// Accept: text/*, application/json
ctx.accepts('image/png');
ctx.accepts('png');
// => false

// Accept: text/*;q=.5, application/json
ctx.accepts(['html', 'json']);
ctx.accepts('html', 'json');
// => "json"

// No Accept header
ctx.accepts('html', 'json');
// => "html"
ctx.accepts('json', 'html');
// => "json"
```

You may call ctx.accepts() as many times as you like, or use a switch:

```js
switch (ctx.accepts('json', 'html', 'text')) {
  case 'json': break;
  case 'html': break;
  case 'text': break;
  default: ctx.throw(406, 'json, html, or text only');
}
```
#### ctx.acceptsEncodings(encodings)

Check if encodings are acceptable, returning the best match when true, otherwise false. Note that you should include identity as one of the encodings!

```js
// Accept-Encoding: gzip
ctx.acceptsEncodings('gzip', 'deflate', 'identity');
// => "gzip"

ctx.acceptsEncodings(['gzip', 'deflate', 'identity']);
// => "gzip"
```

When no arguments are given all accepted encodings are returned as an array:

```js
// Accept-Encoding: gzip, deflate
ctx.acceptsEncodings();
// => ["gzip", "deflate", "identity"]
```
Note that the identity encoding (which means no encoding) could be unacceptable if the client explicitly sends identity;q=0. Although this is an edge case, you should still handle the case where this method returns false.

#### ctx.acceptsCharsets(charsets)

Check if charsets are acceptable, returning the best match when true, otherwise false.

```js
// Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5
ctx.acceptsCharsets('utf-8', 'utf-7');
// => "utf-8"

ctx.acceptsCharsets(['utf-7', 'utf-8']);
// => "utf-8"
```

When no arguments are given all accepted charsets are returned as an array:

```js
// Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5
ctx.acceptsCharsets();
// => ["utf-8", "utf-7", "iso-8859-1"]
```
#### ctx.acceptsLanguages(langs)

Check if langs are acceptable, returning the best match when true, otherwise false.

```js
// Accept-Language: en;q=0.8, es, pt
ctx.acceptsLanguages('es', 'en');
// => "es"

ctx.acceptsLanguages(['en', 'es']);
// => "es"
```

When no arguments are given all accepted languages are returned as an array:

```js
// Accept-Language: en;q=0.8, es, pt
ctx.acceptsLanguages();
// => ["es", "pt", "en"]
```

#### ctx.get(field)

Return request header.

```js
const host = ctx.get('host');
```

#### ctx.body

Get response body.

#### ctx.body=

Set response body to one of the following:

* string written

  The Content-Type is defaulted to text/html or text/plain, both with a default charset of utf-8. The Content-Length field is also set.

* Buffer written

  The Content-Type is defaulted to application/octet-stream, and Content-Length is also set.

* Stream piped

  The Content-Type is defaulted to application/octet-stream.

  Whenever a stream is set as the response body, .onerror is automatically added as a listener to the error event to catch any errors. In addition, whenever the request is closed (even prematurely), the stream is destroyed. If you do not want these two features, do not set the stream as the body directly. For example, you may not want this when setting the body as an HTTP stream in a proxy as it would destroy the underlying connection.

  See: https://github.com/koajs/koa/pull/612 for more information.

  Here's an example of stream error handling without automatically destroying the stream:

  ```js
  const PassThrough = require('stream').PassThrough;

  app.use(function * (next) {
    ctx.body = someHTTPStream.on('error', ctx.onerror).pipe(PassThrough());
  });
  ```

* Object || Array json-stringified

  The Content-Type is defaulted to application/json. This includes plain objects { foo: 'bar' } and arrays ['foo', 'bar'].

* null no content response

If ctx.status has not been set, Koa will automatically set the status to 200 or 204.

#### ctx.status

Get response status. By default, response.status is set to 404 unlike node's res.statusCode which defaults to 200.

#### ctx.status=

Set response status via numeric code:

* 100 "continue"
* 101 "switching protocols"
* 102 "processing"
* 200 "ok"
* 201 "created"
* 202 "accepted"
* 203 "non-authoritative information"
* 204 "no content"
* 205 "reset content"
* 206 "partial content"
* 207 "multi-status"
* 208 "already reported"
* 226 "im used"
* 300 "multiple choices"
* 301 "moved permanently"
* 302 "found"
* 303 "see other"
* 304 "not modified"
* 305 "use proxy"
* 307 "temporary redirect"
* 308 "permanent redirect"
* 400 "bad request"
* 401 "unauthorized"
* 402 "payment required"
* 403 "forbidden"
* 404 "not found"
* 405 "method not allowed"
* 406 "not acceptable"
* 407 "proxy authentication required"
* 408 "request timeout"
* 409 "conflict"
* 410 "gone"
* 411 "length required"
* 412 "precondition failed"
* 413 "payload too large"
* 414 "uri too long"
* 415 "unsupported media type"
* 416 "range not satisfiable"
* 417 "expectation failed"
* 422 "unprocessable entity"
* 423 "locked"
* 424 "failed dependency"
* 426 "upgrade required"
* 428 "precondition required"
* 429 "too many requests"
* 431 "request header fields too large"
* 500 "internal server error"
* 501 "not implemented"
* 502 "bad gateway"
* 503 "service unavailable"
* 504 "gateway timeout"
* 505 "http version not supported"
* 506 "variant also negotiates"
* 507 "insufficient storage"
* 508 "loop detected"
* 510 "not extended"
* 511 "network authentication required"

NOTE: don't worry too much about memorizing these strings, if you have a typo an error will be thrown, displaying this list so you can make a correction.


#### ctx.message

Get response status message. By default, response.message is associated with response.status.

#### ctx.message=

Set response status message to the given value.

#### ctx.length=

Set response Content-Length to the given value.

#### ctx.length

Return response Content-Length as a number when present, or deduce from ctx.body when possible, or undefined.


#### ctx.type

Get response Content-Type void of parameters such as "charset".

```js
const ct = ctx.type;
// => "image/png"
```

#### ctx.type=

Set response Content-Type via mime string or file extension.

```js
ctx.type = 'text/plain; charset=utf-8';
ctx.type = 'image/png';
ctx.type = '.png';
ctx.type = 'png';
```

Note: when appropriate a charset is selected for you, for example response.type = 'html' will default to "utf-8", however when explicitly defined in full as response.type = 'text/html' no charset is assigned.

#### ctx.headerSent

Check if a response header has already been sent. Useful for seeing if the client may be notified on error.


#### ctx.redirect(url, [alt])

Perform a [302] redirect to url.

The string "back" is special-cased to provide Referrer support, when Referrer is not present alt or "/" is used.

```js
ctx.redirect('back');
ctx.redirect('back', '/index.html');
ctx.redirect('/login');
ctx.redirect('http://google.com');
```

To alter the default status of 302, simply assign the status before or after this call. To alter the body, assign it after this call:

```js
ctx.status = 301;
ctx.redirect('/cart');
ctx.body = 'Redirecting to shopping cart';
```
#### ctx.attachment([filename])
Set Content-Disposition to "attachment" to signal the client to prompt for download. Optionally specify the filename of the download.

#### ctx.set(fields)

Set several response header fields with an object:

```js
ctx.set({
  'Etag': '1234',
  'Last-Modified': date
});
```

#### ctx.append(field, value)

Append additional header field with value val.

```js
ctx.append('Link', '<http://127.0.0.1/>');
```

#### ctx.remove(field)

Remove header field.

#### ctx.lastModified=

Set the Last-Modified header as an appropriate UTC string. You can either set it as a Date or date string.

```js
ctx.lastModified = new Date();
```
#### ctx.etag=

Set the ETag of a response including the wrapped "s. Note that there is no corresponding response.etag getter.

```js
ctx.etag = crypto.createHash('md5').update(ctx.body).digest('hex');
```
### 框架扩展 API

#### ctx.module

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

#### ctx.controller

路由解析后的控制器名，默认是通过 [think-router](https://github.com/thinkjs/think-router) 模块解析。

```js
module.exports = class extends think.Controller {
  __before() {
    // 获取解析后的 controller
    const controller = this.ctx.controller;
  }
}
```

#### ctx.action

路由解析后的操作名，默认是通过 [think-router](https://github.com/thinkjs/think-router) 模块解析。

```js
module.exports = class extends think.Controller {
  __before() {
    // 获取解析后的 action
    const action = this.ctx.action;
  }
}
```

#### ctx.userAgent

可以通过 `ctx.userAgent` 属性获取用户的 userAgent。

```js
const userAgent = ctx.userAgent;
if(userAgent.indexOf('spider')){
  ...
}
```

#### ctx.isGet

可以通过 `ctx.isGet` 判断当前请求类型是否是 `GET`。

```js
const isGet = ctx.isGet;
if(isGet){
  ...
}
```

#### ctx.isPost

可以通过 `ctx.isPost` 判断当前请求类型是否是 `POST`。

```js
const isPost = ctx.isPost;
if(isPost){
  ...
}
```

#### ctx.isCli

可以通过 `ctx.isCli` 判断当前请求类型是否是 `CLI`（命令行调用）。

```js
const isCli = ctx.isCli;
if(isCli){
  ...
}
```

#### ctx.referer(onlyHost)

* `onlyHost` {Boolean} 是否只返回 host
* `return` {String}

获取请求的 referer。

```
const referer1 = ctx.referer(); // http://www.thinkjs.org/doc.html
const referer2 = ctx.referer(true); // www.thinkjs.org
```

#### ctx.referrer(onlyHost)

等同于 `referer` 方法。

#### ctx.isMethod(method)

* `method` {String} 请求类型
* `return` {Boolean}

判断当前请求类型与 method 是否相同。

```js
const isPut = ctx.isMethod('PUT');
```

#### ctx.isAjax(method)

* `method` {String} 请求类型
* `return` {Boolean}

判断是否是 ajax 请求（通过 header 中 `x-requested-with` 值是否为 `XMLHttpRequest` 判断），如果执行了 method，那么也会判断请求类型是否一致。

```js
const isAjax = ctx.isAjax();
const isPostAjax = ctx.isAjax('POST');
```

#### ctx.isJsonp(callbackField)

* `callbackField` {String} callback 字段名，默认值为 `this.config('jsonpCallbackField')`
* `return` {Boolean}

判断是否是 jsonp 请求。

```js
const isJsonp = ctx.isJson('callback');
if(isJsonp){
  ctx.jsonp(data);
}
```

#### ctx.jsonp(data, callbackField)

* `data` {Mixed} 要输出的数据
* `callbackField` {String} callback 字段名，默认值为 `this.config('jsonpCallbackField')`
* `return` {Boolean} false

输出 jsonp 格式的数据，返回值为 false。可以通过配置 `jsonContentType` 指定返回的 `Content-Type`。

```js
ctx.jsonp({name: 'test'});

//output
jsonp111({
  name: 'test'
})
```

#### ctx.json(data)

* `data` {Mixed} 要输出的数据
* `return` {Boolean} false

输出 json 格式的数据，返回值为 false。可以通过配置 `jsonContentType` 指定返回的 `Content-Type`。

```js
ctx.json({name: 'test'});

//output
{
  name: 'test'
}
```

#### ctx.success(data, message)

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

#### ctx.fail(errno, errmsg, data)

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

#### ctx.expires(time)

* `time` {Number} 缓存的时间，单位是毫秒。可以 `1s`，`1m` 这样的时间
* `return` {undefined}

设置 `Cache-Control` 和 `Expires` 缓存头。

```js
ctx.expires('1h'); //缓存一小时
```

#### ctx.config(name, value, m)

* `name` {Mixed} 配置名
* `value` {Mixed} 配置值
* `m` {String} 模块名，多模块项目下生效
* `return` {Mixed} 

获取、设置配置项，内部调用 `think.config` 方法。

```js
ctx.config('name'); //获取配置
ctx.config('name', value); //设置配置值
ctx.config('name', undefined, 'admin'); //获取 admin 模块下配置值，多模块项目下生效
```

#### ctx.param(name, value)

* `name` {String} 参数名
* `value` {Mixed} 参数值
* `return` {Mixed}

获取、设置 URL 上的参数值。由于 `get`、`query` 等名称已经被 Koa 使用，所以这里只能使用 param。

```js
ctx.param('name'); //获取参数值，如果不存在则返回 undefined
ctx.param(); //获取所有的参数值，包含动态添加的参数
ctx.param('name1,name2'); //获取指定的多个参数值，中间用逗号隔开
ctx.param('name', value); //重新设置参数值
ctx.param({name: 'value', name2: 'value2'}); //重新设置多个参数值
```

#### ctx.post(name, value)

* `name` {String} 参数名
* `value` {Mixed} 参数值
* `return` {Mixed}

获取、设置 POST 数据。

```js
ctx.post('name'); //获取 POST 值，如果不存在则返回 undefined
ctx.post(); //获取所有的 POST 值，包含动态添加的数据
ctx.post('name1,name2'); //获取指定的多个 POST 值，中间用逗号隔开
ctx.post('name', value); //重新设置 POST 值
ctx.post({name: 'value', name2: 'value2'}); //重新设置多个 POST 值
```

#### ctx.file(name, value)

* `name` {String} 参数名
* `value` {Mixed} 参数值
* `return` {Mixed}

获取、设置文件数据，文件会保存在临时目录下，为了安全，请求结束后会删除。如果需要使用对应的文件，可以通过 `fs.rename` 方法移动到其他地方。

```js
ctx.file('name'); //获取 FILE 值，如果不存在则返回 undefined
ctx.file(); //获取所有的 FILE 值，包含动态添加的数据
ctx.file('name', value); //重新设置 FILE 值
ctx.file({name: 'value', name2: 'value2'}); //重新设置多个 FILE 值
```

文件的数据格式为：

```js
{
  "size": 287313, //文件大小
  "path": "/var/folders/4j/g57qvmmd1lb_9h605w_d38_r0000gn/T/upload_fa6bf8c44179851f1cfec99544b4ef22", //临时存放的位置
  "name": "An Introduction to libuv.pdf", //文件名
  "type": "application/pdf", //类型
  "mtime": "2017-07-02T07:55:23.763Z" //最后修改时间
}
```

文件上传是通过 [think-payload](https://github.com/thinkjs/think-payload) 模块解析的，可以配置限制文件大小之类的参数。

```js
const fs = require('fs');
const path = require('path');
const rename = think.promisify(fs.rename, fs); // 通过 promisify 方法把 rename 方法包装成 Promise 接口
module.exports = class extends think.Controller {
  async indexAction(){
    const file = this.file('image');
    // 如果上传的是 png 格式的图片文件，则移动到其他目录
    if(file && file.type === 'image/png') {
      const filepath = path.join(think.ROOT_PATH, 'runtime/upload/a.png');
      think.mkdir(path.dirname(filepath));
      await rename(file.path, filepath)
    }
  }
}
```



#### ctx.cookie(name, value, options)

* `name` {String} Cookie 名
* `value` {mixed} Cookie 值
* `options` {Object} Cookie 配置项
* `return` {Mixed}

获取、设置 Cookie 值。

```js
ctx.cookie('name'); //获取 Cookie
ctx.cookie('name', value); //设置 Cookie
ctx.cookie(name, null); //删除 Cookie
ctx.cookie(name, null, {
  path: '/'
})
```

设置 Cookie 时，如果 value 的长度大于 4094，则触发 `cookieLimit` 事件，该事件可以通过 `think.app.on("cookieLimit")` 来捕获。

删除 Cookie 时，必须要设置 `domain`、`path` 等参数和设置的时候相同，否则因为浏览器的同源策略无法删除。

#### ctx.service(name, m, ...args)

* `name` {String} 要调用的 service 名称
* `m` {String} 模块名，多模块项目下生效
* `return` {Mixed}

获取 service，如果是类则实例化，否则直接返回。

```js
// 获取 src/service/github.js 模块
const github = ctx.service('github');
```

#### ctx.download(filepath, filename)

* `filepath` {String} 下载文件的路径
* `filename` {String} 下载的文件名，如果没有则从 `filepath` 中获取。

下载文件，会通过 [content-disposition](https://github.com/jshttp/content-disposition) 模块设置 `Content-Disposition` 头信息。

```js
const filepath = path.join(think.ROOT_PATH, 'a.txt');
ctx.download(filepath);
```

如果文件名中含有中文导致乱码，那么可以自己手工指定 `Content-Disposition` 头信息，如：

```js
const userAgent = this.userAgent().toLowerCase();
let hfilename = '';
if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
  hfilename = `=${encodeURIComponent(filename)}`;
} else if(userAgent.indexOf('firefox') >= 0) {
  hfilename = `*="utf8''${encodeURIComponent(filename)}"`;
} else {
  hfilename = `=${new Buffer(filename).toString('binary')}`;
}
ctx.set('Content-Disposition', `attachment; filename${hfilename}`)
ctx.download(filepath)
```