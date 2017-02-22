## http

这里的 http 对象并不是 Node.js 里的 http 模块，而是对 request 和 response 对象包装后一个新的对象。

```js
var http = require('http');

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');
}).listen(8124);
```

如上面的代码所示，Node.js 创建服务时，会传递 request 和 response 2个对象给回调函数。为了后续调用方便， ThinkJS 对这2个对象进行了包装，包装成了 http 对象，并且提供很多有用的方法。

http 对象会在 middleware, logic, controller, view 中传递。


`注`：http 对象是 EventEmitter 的一个实例，所以可以对其进行事件监听和执行。


### 属性

#### http.req

系统原生的 request 对象

#### http.res

系统原生的 response 对象

#### http.startTime

请求的开始时间，是个`unix`时间戳。

#### http.url

当前请求的 url 。

#### http.version

当前请求的 http 版本。

#### http.method

当前请求的类型。

#### http.headers

当前请求的所有头信息。

#### http.pathname

当前请求的 pathname，路由识别会依赖该值，会在后续的处理中对其进行改变。所以在 action 拿到值可能跟初始解析出来的值不一致。

#### http.query

当前请求的所有 query 数据。

#### http.host

当前请求的 host， 包含端口。

#### http.hostname

当前请求的 hostname，不包含端口。

#### http.payload

当前请求的 payload 数据，提交型的请求才含有该值。

#### http._payloadParsed

表示当前请求的 payload 数据是否已经解析。

#### http._get

存放 GET 参数值。

#### http._post

存放 POST 参数值

#### http._file

存放上传的文件数据

#### http._cookie

存放 cookie 数据。

#### http.module

当前请求解析后对应的模块名。

#### http.controller

当前请求解析后对应的控制器名。

#### http.action

当前请求解析后对应的操作名。

### 方法

#### http.config(name)

* `name` {String} 参数名
* `return` {Mixed} 返回对应的参数值

获取当前请求下对应的参数值。

#### http.referrer()

* `return` {String} 请求的 referrer

返回当前请求的 referrer。

#### http.userAgent()

* `return` {String} 请求的 userAgent

返回当前请求的 userAgent。

#### http.isGet()

* `return` {Boolean}

返回当前请求是否是 GET 请求。

#### http.isPost()

* `return` {Boolean}

返回当前请求是否是 POST 请求。

#### http.isAjax(method)

* `method` {String} 请求类型
* `return` {Boolean}

返回当前请求是否是 Ajax 请求。

```js
http.isAjax(); //判断是否是Ajax请求
http.isAjax('GET'); //判断是否是Ajax请求，且请求类型是GET
```

#### http.isJsonp(name)

* `name` {String} callback 参数名称，默认为 callback
* `return` {Boolean}

返回当前请求是否是 jsonp 请求。

```js
//url is  /index/test?callback=testxxx
http.isJsonp(); //true
http.isJsonp('cb'); //false
```


#### http.get(name, value)

* `name` {String} 参数名称
* `value` {Mixed} 参数值

获取或者设置 GET 参数值。可以通过该方法设置 GET 参数值，方便后续的逻辑里获取。

```js
// url is /index/test?name=thinkjs
http.get('name'); // returns 'thinkjs'
http.get('name', 'other value');
http.get('name'); // returns 'other value'
```


#### http.post(name, value)

* `name` {String} 参数名称
* `value` {Mixed} 参数值

获取或者设置 POST 值。可以通过该方法设置 POST 值，方便后续的逻辑里获取。

```js
http.post('email'); //获取提交的email
```

#### http.param(name)

* `name` {String} 参数名称
* `return` {Mixed}

获取参数值，优先从 POST 里获取，如果值为空，则从 URL 参数里获取。


#### http.file(name)

* `name` {String} 文件对应的字段名称
* `return` {Object} 

获取上传的文件。

```js
http.file('image');
//returns 
{
  fieldName: 'image', //表单里的字段名
  originalFilename: filename, //原始文件名
  path: filepath, //文件临时存放的路径
  size: size //文件大小
}
```

#### http.header(name, value)

* `name` {String} header 名称
* `value` {String} header 值

获取或者设置 header 信息。

```js
http.header('accept'); //获取accept
http.header('X-NAME', 'thinkjs'); //设置header
```

#### http.expires(time)

* `time` {Number} 过期时间，单位为秒

强缓存，设置 `Cache-Control` 和 `Expires` 头信息。

```js
http.header(86400); //设置过期时间为 1 天。
```

#### http.status(status)

设置状态码。如果头信息已经发送，则无法设置状态码。

```js
http.status(400); //设置状态码为400
```

#### http.ip()

获取用户的 ip 。如果使用了代理，获取的值可能不准。

#### http.lang(lang, asViewPath)

* `lang` {String} 要设置的语言
* `asViewPath` {Boolean} 是否添加一层模版语言目录

获取或者设置国际化的语言，可以支持模版路径要多一层语言的目录。

##### 获取语言

```js
let lang = http.lang();
```

获取语言的循序为 `http._lang` -> `从 cookie 中获取` -> `从 header 中获取`，如果需要从 url 中解析语言，可以获取后通过 `http.lang(lang)` 方法设置到属性 `http._lang` 中。

##### 设置语言

```js
let lang = getFromUrl();
http.lang(lang, true); //设置语言，并指定模版路径中添加一层语言目录
```

#### http.theme(theme)

获取或者设置主题，设置后模版路径要多一层主题的目录。

#### http.cookie(name, value)

* `name` {String} cookie 名称
* `value` {String} cookie 值

读取或者设置 cookie 值。

```js
http.cookie('think_test'); //获取名为 think_test 的 cookie
http.cookie('name', 'value'); //设置 cookie，如果头信息已经发送则设置无效
http.cookie('name', null); //删除 cookie
```


#### http.session(name, value)

* `name` {String} session 名
* `value` {Mixed} session 值
* `return` {Promise}

读取、设置和清除 session。

##### 读取 Session

```js
let value = await http.session('userInfo');
```

##### 设置 Session

```js
await http.session('userInfo', data);
```

##### 清除 Session

```js
await http.session();
```

#### http.redirect(url, status)

* `url` {String} 要跳转的 url
* `status` {Number} 状态码， 301 或者 302，默认为302

页面跳转。

```js
http.redirect('/login'); //跳转到登录页面
```

#### http.type(contentType, encoding)

* `contentType` {String} 要设置的 contentType
* `encoding` {String} 要设置的编码

获取或者设置 Content-Type。

```js
http.type(); //获取Content-Type
http.type('text/html'); //设置Content-Type，会自动加上charset
http.type('audio/mpeg', false); //设置Content-Type，不追加charset
```

#### http.write(content, encoding)

* `content` {Mixed} 要输出的内容
* `encoding` {String} 编码

输出内容，要调用 http.end 才能结束当前请求。

#### http.end(content, encoding)

* `content` {Mixed} 要输出的内容
* `encoding` {String} 编码

输出内容并结束当前请求。

#### http.success(data, message)

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

#### http.fail(errno, errmsg, data)

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

#### http.json(data)

* `data` {Object}

json 方式输出数据，会设置 Content-Type 为 `application/json`，该值对应的配置为`json_content_type`。

