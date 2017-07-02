## Controller

控制器是一类操作的集合，用来响应用户同一类的请求。比如：将用户相关的操作都放在 `user.js` 里，每一个操作就是里面一个 Action。

### 创建 Controller

创建的 controller 都需要继承自 `think.Controller` 类，这样就能使用一些内置的方法。当然项目一般会创建一些通用的基类，然后实际的 controller 都继承自这个基类。

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

创建完成后，框架会监听变化然后重启服务。这时访问 `http://127.0.0.1:8360/user/index` 就可以看到输出的 `hello word!`

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

### ctx 对象

controller 实例化时会传入 `ctx` 对象，在 controller 里可以通过 `this.ctx` 来获取 ctx 对象。并且 controller 上很多方法也是通过调用 ctx 里的方法来实现的。

### API


### 属性

#### controller.ctx

传递进来的 ctx 对象。

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


#### controller.ips

* `return` {Array}

获取当前请求链路的所有 ip，等同于 ctx.ips 方法。


#### controller.method

* `return` {String}

获取当前请求的类型，转化为小写。

#### controller.isGet

* `return` {Boolean}

判断是否是 GET 请求。

#### controller.isPost

* `return` {Boolean}

判断是否是 POST 请求。

#### controller.isCli

* `return` {Boolean}

是否是命令行下调用。

#### controller.userAgent

获取 userAgent。

### 方法

#### controller.isMethod(method)

* `method` {String} 类型
* `return` {Boolean}

判断当前的请求类型是否是指定的类型。


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

* `name` {String} 参数名

获取 GET 参数值。

```js
module.exports = class extends think.Controller {
  indexAction(){
    //获取一个参数值
    let value = this.get('xxx');
    //获取所有的参数值
    let values = this.get();
  }
}
```

#### controller.post(name)

* `name` {String} 参数名

获取 POST 提交的参数。

```js
module.exports = class extends think.Controller {
  indexAction(){
    //获取一个参数值
    let value = this.post('xxx');
    //获取所有的 POST 参数值
    let values = this.post();
  }
}
```

#### controller.param(name)

* `name` {String} 参数名

获取参数值，优先从 POST 里获取，如果取不到再从 GET 里获取。


#### controller.file(name)

* `name` {String} 上传文件对应的字段名

获取上传的文件，返回值是个对象，包含下面的属性：

```js
{
  fieldName: 'file', //表单字段名称
  originalFilename: filename, //原始的文件名
  path: filepath, //文件保存的临时路径，使用时需要将其移动到项目里的目录，否则请求结束时会被删除
  size: 1000 //文件大小
}
```

如果文件不存在，那么值为一个空对象 `{}`。该方法等同于 ctx.file 方法。

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

* `time` {Number} 过期时间，单位为秒

强缓存，设置 `Cache-Control` 和 `Expires` 头信息。

```js
module.exports = class extends think.Controller {
  indexAction(){
    this.expires(86400); //设置过期时间为 1 天。
  }
}
```
该方法等同于 ctx.expires 方法。

#### controller.referer(onlyHost)

* `referrer` {Boolean} 是否只需要 host

获取 referrer。

#### controller.referrer(onlyHost)

该方法等同于 controller.referer 方法。

#### controller.cookie(name, value, options)

* `name` {String} cookie 名
* `value` {String} cookie 值
* `options` {Object}

获取、设置或者删除 cookie。

```js
module.exports = class extends think.Controller {
  indexAction(){
    //获取 cookie 值
    let value = this.cookie('think_name');
  }
}
```

```js
module.exports = class extends think.Controller {
  indexAction(){
    //设置 cookie 值
    this.cookie('think_name', value, {
      timeout: 3600 * 24 * 7 //有效期为一周
    });
  }
}
```

```js
module.exports = class extends think.Controller {
  indexAction(){
    //删除 cookie
    this.cookie('think_name', null); 
  }
}
```

#### controller.redirect(url)

* `url` {String} 要跳转的 url

页面跳转。

#### controller.jsonp(data, callback)

* `data` {Mixed} 要输出的内容
* `callback` {String} callback方法名

jsonp 的方法输出内容，获取 callback 名称安全过滤后输出。

```js
module.exports = class extends think.Controller {
  indexAction(){
    this.jsonp({name: 'thinkjs'}, 'callback_fn_name');
    //writes
    'callback_fn_name({name: "thinkjs"})'
  }
}
```

#### controller.json(data)

* `data` {Mixed} 要输出的内容

json 的方式输出内容。

#### controller.status(status)

* `status` {Number} 状态码，默认为 404

设置状态码。

<!--#### controller.type(type, charset)

* `type` {String} Content-Type
* `charset` {Boolean} 是否自动追加 charset

设置 Content-Type。-->

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
```

#### controller.success(data, message)

* `data` {Mixed} 要输出的数据
* `message` {String} 追加的message

格式化输出一个正常的数据，一般是操作成功后输出。

```js
http.success({name: 'thinkjs'});
//writes
{
  errno: 0,
  errmsg: '',
  data: {
    name: 'thinkjs'
  }
}
```

这样客户端就可以根据 `errno` 是否为 `0` 为判断当前请求是否正常。

#### controller.fail(errno, errmsg, data)

* `errno` {Number} 错误号
* `errmsg` {String} 错误信息
* `data` {Mixed} 额外的数据

格式化输出一个异常的数据，一般是操作失败后输出。

`注`：字段名 `errno` 和 `errmsg` 可以在配置里进行修改。

```js
http.fail(100, 'fail')
//writes
{
  errno: 100,
  errmsg: 'fail',
  data: ''
}
```

这样客户端就可以拿到具体的错误号和错误信息，然后根据需要显示了。

`注`：字段名 `errno` 和 `errmsg` 可以在配置里进行修改。
