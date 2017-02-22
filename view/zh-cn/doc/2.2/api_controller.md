## controller

`think.controller.base` 继承自 [think.http.base](./api_think_http_base.html) 类。项目里的控制器需要继承该类。


##### 使用 ES6 的语法继承该类

```js
export default class extends think.controller.base {
  indexAction(){

  }
}
```

##### 使用普通方式继承该类 ##### 

```js
module.exports = think.controller({
  indexAction(){

  }
})
```


### 属性

#### controller.http

传递进来的 [http](./api_http.html) 对象。

### 方法

#### controller.ip()

* `return` {String}

获取当前请求用户的 ip，等同与 http.ip 方法。

```js
export default class extends think.controller.base {
  indexAction(){
    let ip = this.ip();
  }
}
```

#### controller.method()

* `return` {String}

获取当前请求的类型，转化为小写。

```js
export default class extends think.controller.base {
  indexAction(){
    let method = this.method(); //get or post ...
  }
}
```

#### controller.isMethod(method)

* `method` {String} 类型
* `return` {Boolean}

判断当前的请求类型是否是指定的类型。

#### controller.isGet()

* `return` {Boolean}

判断是否是 GET 请求。

#### controller.isPost()

* `return` {Boolean}

判断是否是 POST 请求。

#### controller.isAjax(method)

* `method` {String}
* `return` {Boolean}

判断是否是 Ajax 请求。如果指定了 method，那么请求类型也要相同。

```js
export default class extends think.controller.base {
  indexAction(){
    //是ajax 且请求类型是 POST
    let isAjax = this.isAjax('post');
  }
}
```

#### controller.isWebSocket()

* `return` {Boolean}

是否是 websocket 请求。

#### controller.isCli()

* `return` {Boolean}

是否是命令行下调用。

#### controller.isJsonp(callback)

* `callback` {String} callback 名称
* `return` {Boolean}

是否是 jsonp 请求。

#### controller.get(name)

* `name` {String} 参数名

获取 GET 参数值。

```js
export default class extends think.controller.base {
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
export default class extends think.controller.base {
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

如果文件不存在，那么值为一个空对象 `{}`。

#### controller.header(name, value)

* `name` {String} header 名
* `value` {String} header 值

获取或者设置 header。

```js
export default class extends think.controller.base {
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
export default class extends think.controller.base {
  indexAction(){
    this.expires(86400); //设置过期时间为 1 天。
  }
}
```

#### controller.userAgent()

获取 userAgent。

#### controller.referrer(onlyHost)

* `referrer` {Boolean} 是否只需要 host

获取 referrer。

#### controller.cookie(name, value, options)

* `name` {String} cookie 名
* `value` {String} cookie 值
* `options` {Object}

获取、设置或者删除 cookie。

```js
export default class extends think.controller.base {
  indexAction(){
    //获取 cookie 值
    let value = this.cookie('think_name');
  }
}
```

```js
export default class extends think.controller.base {
  indexAction(){
    //设置 cookie 值
    this.cookie('think_name', value, {
      timeout: 3600 * 24 * 7 //有效期为一周
    });
  }
}
```

```js
export default class extends think.controller.base {
  indexAction(){
    //删除 cookie
    this.cookie('think_name', null); 
  }
}
```
#### controller.session(name, value)

* `name` {String} session 名
* `value` {Mixed} session 值
* `return` {Promise}

读取、设置和清除 session。

##### 读取 Session

```js
export default class extends think.controller.base {
  async indexAction(){
    //获取session
    let value = await this.session('userInfo');
  }
}
```

##### 设置 Session

```js
export default class extends think.controller.base {
  async indexAction(){
    //设置 session
    await this.session('userInfo', data);
  }
}
```

##### 清除 Session

```js
export default class extends think.controller.base {
  async indexAction(){
    //清除当前用户的 session
    await this.session();
  }
}
```

#### controller.lang(lang, asViewPath)

* `lang` {String} 要设置的语言
* `asViewPath` {Boolean} 是否在模版目录添加一层语言目录

读取或者设置语言。

#### controller.locale(key)

* `key` {String} 

根据 language 获取对应的语言文本。


#### controller.redirect(url, statusCode)

* `url` {String} 要跳转的 url
* `statusCode` {Number} 状态码，默认为 302

页面跳转。

#### controller.assign(name, value)

* `name` {String | Object} 变量名
* `value` {Mixed} 变量值

将变量赋值到模版中。

```js
export default class extends think.controller.base {
  indexAction(){
    //单个赋值
    this.assign('title', 'thinkjs');
    //批量赋值
    this.assign({
      name: 'xxx',
      desc: 'yyy'
    })
  }
}
```

#### controller.fetch(templateFile)

* `templateFile` {String} 模版文件地址
* `return` {Promise}

获取解析后的模版内容。

##### 直接获取 ##### 

```js
// 假设文件路径为 /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  async indexAction(){
    // home/index_index.html
    let content = await this.fetch();
  }
}
```

##### 改变 action ##### 

```js
// 假设文件路径为 /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  async indexAction(){
    // home/index_detail.html
    let content = await this.fetch('detail');
  }
}
```

##### 改变 controller 和 action ##### 

```js
// 假设文件路径为 /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  async indexAction(){
    // home/user_detail.html
    let content = await this.fetch('user/detail');
  }
}
```

##### 改变 module, controller 和 action ##### 

```js
// 假设文件路径为 /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  async indexAction(){
    // admin/user_detail.html
    let content = await this.fetch('admin/user/detail');
  }
}
```

##### 改变文件后缀名 ##### 

```js
// 假设文件路径为 /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  async indexAction(){
    // home/index_detail.xml
    let content = await this.fetch('detail.xml');
  }
}
```

##### 获取绝对路径文件 ##### 

```js
// 假设文件路径为 /foo/bar/app/home/controller/index.js
export default class extends think.controller.base {
  async indexAction(){
    // /home/xxx/aaa/bbb/c.html
    let content = await this.fetch('/home/xxx/aaa/bbb/c.html');
  }
}
```

#### controller.display(templateFile)

* `templateFile` {String} 模版文件路径

输出模版内容到浏览器端。查找模版文件策略和 `controller.fetch` 相同。

#### controller.jsonp(data)

* `data` {Mixed} 要输出的内容

jsonp 的方法输出内容，获取 callback 名称安全过滤后输出。

```js
export default class extends think.controller.base {
  indexAction(){
    this.jsonp({name: 'thinkjs'});
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

#### controller.deny(status)

* `status` {String} 状态码，默认为 403

拒绝当前请求。

#### controller.write(data, encoding)

* `data` {mixed} 要输出的内容
* `encoding` {String} 编码

输出内容

#### controller.end(data, encoding)

* `data` {mixed} 要输出的内容
* `encoding` {String} 编码

输出内容后结束当前请求。

#### controller.type(type, charset)

* `type` {String} Content-Type
* `charset` {Boolean} 是否自动追加 charset

设置 Content-Type。

#### controller.download(filePath, contentType, fileName)

* `filePath` {String} 下载文件的具体路径
* `content-Type` {String} Content-Type
* `fileName` {String} 保存的文件名

下载文件。

```js
export default class extends think.controller.base {
  indexAction(){
    let filePath = think.RESOUCE_PATH + '/a.txt';
    //自动识别 Content-Type，保存的文件名为 a.txt
    this.download(filePath);
  }
}
```

```js
export default class extends think.controller.base {
  indexAction(){
    let filePath = think.RESOUCE_PATH + '/a.log';
    //自动识别 Content-Type，保存的文件名为 b.txt
    this.download(filePath, 'b.txt');
  }
}
```

```js
export default class extends think.controller.base {
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

#### controller.sendTime(name)

* `name` {String} header key

发送请求的执行时间，使用 header 的方式发出。
