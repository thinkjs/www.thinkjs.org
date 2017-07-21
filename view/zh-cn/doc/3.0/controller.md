## Controller

MVC 模型中，控制器是用户请求的逻辑处理部分。比如：将用户相关的操作都放在 `user.js` 里，每一个操作就是里面一个 Action。

### 创建 Controller

项目中的 controller 需要继承 `think.Controller` 类，这样能使用一些内置的方法。当然项目中可以创建一些通用的基类，然后实际的 controller 都继承自这个基类。

项目创建时会自动创建了一个名为 `base.js` 的基类，其他 controller 继承该类即可。

```js
//src/controller/user.js

const Base = require('./base.js');
module.exports = class extends Base {
  indexAction(){
    this.body = 'hello word!';
  }
}
```

创建完成后，框架会监听文件变化然后重启服务。这时访问 `http://127.0.0.1:8360/user/index` 就可以看到输出的 `hello word!`

### Action 执行

Action 执行是通过中间件 [think-controller](https://github.com/thinkjs/think-controller) 来完成的，通过 `ctx.action` 值在 controller 寻找 `xxxAction` 的方法名并调用，且调用相关的魔术方法。

### 前置操作 __before

项目中，有时候需要在一个统一的地方做一些操作，如：判断是否已经登录，如果没有登录就不能继续后面行为。此种情况下，可以通过内置的 `__before` 来实现。

`__before` 是在调用具体的 Action 之前调用的，这样就可以在其中做一些处理。

```js
module.exports = class extends think.Controller {
  async __before(){
    const userInfo = await this.session('userInfo');
    //获取用户的 session 信息，如果为空，返回 false 阻止后续的行为继续执行
    if(think.isEmpty(userInfo)){
      return false;
    }
  }
  indexAction(){
    // __before 调用完成后才会调用 indexAction
  }
}
```

### 后置操作 __after

后置操作 `__after` 与 `__before` 对应，只是在具体的 Action 执行之后执行，如果具体的 Action 执行返回了 `false`，那么 `__after` 不再执行。

```js
module.exports = class extends think.Controller {
  indexAction(){

  }
  __after(){
    //indexAction 执行完成后执行，如果 indexAction 返回了 false 则不再执行
  }
}
```

### 魔术方法 __call

当解析后的 url 对应的控制器存在，但 Action 不存在时，会试图调用控制器下的魔术方法 `__call`。这里可以对不存在的方法进行统一处理。

```js
module.exports = class extends think.Controller {
  indexAction(){

  }
  __call(){
    //如果相应的Action不存在则调用改方法
  }
}
```

### ctx 对象

Controller 实例化时会传入 [ctx](/doc/3.0/context.html) 对象，在 Controller 里可以通过 `this.ctx` 来获取 ctx 对象，并且 Controller 上很多方法也是通过调用 ctx 里的方法来实现的。

如果子类中需要重写 constructor 方法，那么需要调用父类中的 constructor，并将 ctx 参数传递进去：

```js
const Base = require('./base.js');
module.exports = class extends Base {
  constructor(ctx){
    super(ctx); // 调用父级的 constructor 方法，并把 ctx 传递进去
    // 其他额外的操作
  }
}
```

### 多级控制器

有时候项目比较复杂，文件较多，所以希望根据功能进行一些划分。如：用户端的功能放在一块、管理端的功能放在一块。

这时可以借助多级控制器来完成这个功能，在 `src/controller/` 目录下创建 `user/` 和 `admin/` 目录，然后用户端的功能文件都放在 `user/` 目录下，管理端的功能文件都放在 `admin/` 目录下。访问时带上对应的目录名，路由解析时会优先匹配目录下的控制器。

假如控制器下有 console 子目录，下有 user.js 文件，即：`src/controller/console/user.js`，当访问请求为 `/console/user/login` 时，会优先解析出 Controller 为 `console/user`，Action 为 `login`。

### 阻止后续逻辑执行

Controller 里的处理顺序依次为 `__before`、`xxxAction`、`__after`，有时候在一些特定的场景下，需要提前结束请求，阻止后续的逻辑继续执行。这时候可以通过 `return false` 来处理。

```js
module.exports = class extends think.Controller {
  __before() {
    if(!user.isLogin) {
      return false; // 这里 return false，那么 xxxAction 和 __after 不再执行
    }
  }
  xxxAction() {
    // action 里 return false，那么 __after 则不再执行
  }
  __after() {

  }
}
```

### 获取参数、表单值

对于 URL 上传递的参数或者表单上传的值，框架直接做了解析，可以直接通过对应的方法获取。
对于 URL 上传递的参数，在 Action 中可以通过 [get](/doc/3.0/controller.html#toc-b4e) 方法获取。对于表单提交的字段或者文件可以通过 [post](/doc/3.0/controller.html#toc-3d4) 和 [file](/doc/3.0/controller.html#toc-88b) 方法获取。表单数据解析是通过中间件 [think-payload](https://github.com/thinkjs/think-payload) 来完成的，解析后的数据放在 `ctx.request.body` 对象上，最后包装成 post 和 file 方法供使用。

### 透传数据

由于用户的请求处理经过了中间件、Logic、Controller 等多层的处理，有时候希望在这些环节中透传一些数据，这时候可以通过 `ctx.state.xxx` 来完成。

```js
// 中间件中设置 state
(ctx, next) => {
  ctx.state.userInfo = {};
}

// Logic、Controller 中获取 state
indexAction() {
  const userInfo = this.ctx.state.userInfo;
}
```
透传数据时避免直接在 `ctx` 对象上添加属性，这样可能会覆盖已有的属性，引起一些奇怪的问题。

### API


#### controller.ctx

传递进来的 `ctx` 对象。

#### controller.body

* `return` {String}

设置或者获取返回内容


```js
module.exports = class extends think.Controller {
  indexAction(){
    this.body = 'hello world';
  }
}
```

#### controller.ip

* `return` {String}

获取当前请求用户的 ip，等同于 ctx.ip 方法。

```js
module.exports = class extends think.Controller {
  indexAction() {
    const ip = this.ip; // 获取用户的 IP
  }
}
```


#### controller.ips

* `return` {Array}

获取当前请求链路的所有 ip，等同于 ctx.ips 方法。


#### controller.method

* `return` {String}

获取当前请求的类型，转化为小写。

```js
module.exports = class extends think.Controller {
  indexAction() {
    const method = this.method; // 获取当前请求类型
    if(method === 'options') {

    }
  }
}
```

#### controller.isGet

* `return` {Boolean}

判断是否是 GET 请求。

```js
module.exports = class extends think.Controller {
  indexAction() {
    if(this.isGet) { // 如果是 GET 请求

    }
  }
}
```

#### controller.isPost

* `return` {Boolean}

```js
module.exports = class extends think.Controller {
  indexAction() {
    if(this.isPost) { // 如果是 POST 请求

    }
  }
}
```

判断是否是 POST 请求。

#### controller.isCli

* `return` {Boolean}

是否是命令行下调用，等同于 `think.isCli`。


```js
module.exports = class extends think.Controller {
  indexAction() {
    if(this.isCli) { // 如果是命令行调用

    }
  }
}
```

#### controller.userAgent

获取当前请求的 userAgent。

```js
module.exports = class extends think.Controller {
  indexAction() {
    const userAgent = (this.userAgent || '').toLowerCase();
    if(userAgent.indexOf('spider') > -1) {

    }
  }
}
```

#### controller.isMethod(method)

* `method` {String} 类型
* `return` {Boolean}

判断当前的请求类型是否是指定的类型。

```js
module.exports = class extends think.Controller {
  indexAction() {
    const isDelete = this.isMethod('DELETE'); // 是否是 DELETE 请求
  }
}
```


#### controller.isAjax(method)

* `method` {String}
* `return` {Boolean}

判断是否是 Ajax 请求。如果指定了 method，那么请求类型也要相同。

```js
module.exports = class extends think.Controller {
  indexAction(){
    //是ajax 且请求类型是 POST
    let isAjax = this.isAjax('post');
  }
}
```

#### controller.isJsonp(callback)

* `callback` {String} callback 名称
* `return` {Boolean}

是否是 jsonp 请求。

#### controller.get(name)

获取 query 参数，等同于 [ctx.param](/3.0/context.html#param-name-value)。由于 ctx.get 已经被 Koa 使用，所以无法添加 ctx.get 方法。

#### controller.post(name)

获取 POST 提交的参数，等同于 [ctx.post](/doc/3.0/context.html#post-name-value)。

#### controller.file(name)

等同于 [ctx.file](/doc/3.0/context.html#file-name-value) 方法。

#### controller.header(name, value)

* `name` {String} header 名
* `value` {String} header 值

获取或者设置 header。

```js
module.exports = class extends think.Controller {
  indexAction(){
    let accept = this.header('accept'); //获取 header
    this.header('X-NAME', 'thinks'); //设置 header
  }
}
```

#### controller.expires(time)

设置 Cache-Control 和 Expires 缓存头，等同于 [ctx.expires](/doc/3.0/context.html#expires-time)。

#### controller.referer(onlyHost)

* `referrer` {Boolean} 是否只需要 host

获取 referrer。

#### controller.referrer(onlyHost)

该方法等同于 controller.referer 方法。

#### controller.cookie(name, value, options)

操作 cookie，等同于 [ctx.cookie](/doc/3.0/context.html#cookie-name-value-options)。

#### controller.redirect(url)

* `url` {String} 要跳转的 url

页面跳转。

#### controller.jsonp(data, callback)

输出 jsonp 格式内容，等用于 [ctx.jsonp](/doc/3.0/context.html#jsonp-data-callbackfield)。

#### controller.json(data)

json 的方式输出内容，等同于 [ctx.json](/doc/3.0/context.html#json-data)。

#### controller.status(status)

* `status` {Number} 状态码，默认为 404

设置状态码。

<!--#### controller.type(type, charset)

* `type` {String} Content-Type
* `charset` {Boolean} 是否自动追加 charset

设置 Content-Type。-->
<!--
#### controller.download(filePath, contentType, fileName)

* `filePath` {String} 下载文件的具体路径
* `content-Type` {String} Content-Type
* `fileName` {String} 保存的文件名

下载文件。

```js
module.exports = class extends think.Controller {
  indexAction(){
    let filePath = think.RESOUCE_PATH + '/a.txt';
    //自动识别 Content-Type，保存的文件名为 a.txt
    this.download(filePath);
  }
}
```

```js
module.exports = class extends think.Controller {
  indexAction(){
    let filePath = think.RESOUCE_PATH + '/a.log';
    //自动识别 Content-Type，保存的文件名为 b.txt
    this.download(filePath, 'b.txt');
  }
}
```

```js
module.exports = class extends think.Controller {
  indexAction(){
    let filePath = think.RESOUCE_PATH + '/a.log';
    //指定 Content-Type 为 text/html，保存的文件名为 b.txt
    this.download(filePath, 'text/html', 'b.txt');
  }
}
```-->

#### controller.success(data, message)

格式化输出一个正常的数据，一般是操作成功后输出，等同于 [ctx.success](/doc/3.0/context.html#success-data-message)。


#### controller.fail(errno, errmsg, data)

格式化输出一个异常的数据，一般是操作失败后输出，等同于 [ctx.fail](/doc/3.0/context.html#fail-errno-errmsg-data)。
