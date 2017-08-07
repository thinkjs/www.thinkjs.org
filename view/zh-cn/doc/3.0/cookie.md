## Cookie

由于 HTTP(S) 协议是一个无状态的协议，所以多次请求之间并不知道是来自同一个用户。这样就会带来很多问题，如：有些页面用户登录后才能访问，页面内容根据用户相关。

在早期时代，解决方案一般是生成一个随机 token，以后每次请求都会携带这个 token 来识别用户。这需要在 form 表单中插入一个包含 token 的隐藏域，或者放在 URL 请求的参数上。

这种方式虽然能解决问题，但给开发带来很大的不便，也不利于页面地址的传播。为了解决这个问题，[RFC 2965](https://tools.ietf.org/html/rfc2965) 引用了 Cookie 机制，请求时携带 `Cookie` 头信息，响应时通过 `Set-Cookie` 字段设置 Cookie。

### Cookie 格式

请求时 Cookie 格式为：

```
Cookie: name1=value1; name2=value2; name3=value3 //多个 Cookie 之间用 `; ` 隔开
```
响应时 Cookie 格式为：

```
Set-Cookie: key1=value1; path=path; domain=domain; max-age=max-age-in-seconds; expires=date-in-GMTString-format; secure; httponly
Set-Cookie: key2=value2; path=path; domain=domain; max-age=max-age-in-seconds; expires=date-in-GMTString-format; secure; httponly
```

* `key=value` 名称、值的键值对
* `path=path` 设置在哪个路径下生效，大部分时候设置为 `/`，这样可以在所有路径下生效
* `domain=domain` 设置在哪个域名下生效，会验证 domain 的合法性
* `max-age=max-age-in-seconds` 存活时间，一般跟 expires 配套使用
* `expires=date-in-GMTString-format` 失效日期
* `secure` 只在 `HTTPS` 下生效
* `httponly` 只在 HTTP 请求中携带，JS 无法获取

如果不设置 `max-age` 和 `expires`，那么 Cookie 会随着浏览器的进程退出而销毁。对于不希望 JS 能够获取到 Cookie，一般设置 `httponly` 属性，比如：用户 Session 对应的 Cookie。

虽然标准里并没有对 Cookie 的大小限制的规定，但浏览器一般都会有限制，所以不能将太大的文本保存在 Cookie 中（一般不能超过 4K）。

### 配置

框架中是通过 [cookies](https://github.com/pillarjs/cookies) 模块来进行 Cookie 的读取与设置的，支持如下的配置：

* `maxAge`: cookie的超时时间，表示当前时间（`Date.now()`）之后的毫秒数。
* `expires`: `Date` 对象，表示cookie的到期时间（不指定的话，默认是在会话结束时过期）。
* `path`: 字符串，表示 cookie 的路径（默认是`/`）。
* `domain`: 字符串，表示 cookie 的域（没有默认值）。
* `secure`: 布尔值，表示是否只通过 HTTPS 发送该 cookie（`false`时默认通过HTTP发送，`true`时默认通过HTTPS发送）。
* `httpOnly`: 布尔值，表示是否只通过 HTTP(S)发送该 cookie，而不能被客户端的 JavaScript 访问到（默认是`true`）。
* `sameSite`: 布尔值或字符串，表示是否该 cookie 是一个“同源” cookie（默认是`false`）。可以将其设置为`'strict'`，`'lax'`，或`true` （等价于`strict`）。
* `signed`: 布尔值，表示是否要将该 cookie 签名（默认是`false`）。如果设为`true`，还会发送另一个带有`.sig`后缀的同名 cookie，值为一个 27 字节的 url-safe base64 SHA1 值，表示_cookie-name _ = _ cookie-value_的散列值，相对于第一个 [Keygrip](https://www.npmjs.com/package/keygrip) 键。 此签名密钥用于在下次接收到 cookie 时检测篡改。
* `overwrite`: 布尔值，表示是否覆盖以前设置的同名 cookie（默认为false）。如果设为`true`，在同一个请求中设置的相同名称（不管路径或域）的所有 cookie 将在设置此 cookie 时从 Set-Cookie 头中过滤掉。


如果需要修改上面的配置，可以在配置文件 `src/config/config.js` 中修改。如：

```js
module.exports = {
  cookie: {
    domain: '', 
    path: '/',
    maxAge: 10 * 3600 * 1000, // 10个小时
    signed: true,
    keys: [] // 当 signed 为 true 时，使用 keygrip 库加密时的密钥
  }
}
```

### 操作 cookie

在 ctx、controller、logic 中，提供了 `cookie` 方法来操作 cookie。

#### 获取 cookie

```js
const theme = this.cookie('theme')
```

#### 设置 cookie

```js
this.cookie('theme', 'gray'); 
this.cookie('theme', 'yellow', { // 设定 cookie 时指定额外的配置
  maxAge: 10 * 1000,
  path: '/theme'
})
```

#### 删除 cookie

```js
this.cookie('theme', null)
this.cookie('theme', null, {
  domain: '',
  path: ''
})
```

删除 cookie 时需要和设置 cookie 时同样的 domain 和 path 配置，否则会因为不匹配导致 cookie 删除不成功。

### 常见问题

#### 输出内容后能否再发送 cookie？

由于发送 cookie 是通过 `Set-Cookie` header 字段来完成的，HTTP 协议中，规定 header 信息必须在内容之前发送，所以输出内容后不能再发送 cookie 信息。

如果强制在输出内容之后发送 cookie 等 header 信息，会出现类似下面的错误：

```
[ERROR] - Error: Can't set headers after they are sent.
    at ServerResponse.OutgoingMessage.setHeader (_http_outgoing.js:346:11)
    at Cookies.set (think-demo/node_modules/thinkjs/node_modules/cookies/index.js:115:13)
    at Object.cookie (think-demo/node_modules/thinkjs/lib/extend/context.js:260:21)
    at IndexController.cookie (think-demo/node_modules/thinkjs/lib/extend/controller.js:181:21)
    at Timeout._onTimeout (think-demo/src/controller/index.js:10:12)
    at tryOnTimeout (timers.js:224:11)
    at Timer.listOnTimeout (timers.js:198:5)

```
