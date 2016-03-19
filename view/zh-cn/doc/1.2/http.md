## http 对象

这里讲的 http 对象并不是 Node.js 里的 http 模块，而是 ThinkJS 里将 http 请求的 Request 和 Response 2 部分包装在一起的一个对象。

由于 Node.js 是启服务的方式运行，所以处理用户请求时必须将当前请求的 Request 和 Response 对象向后续的处理逻辑里传递，比如：express 里有 req, res 对象。ThinkJS 里为了方便处理，将 Request 和 Response 包装成了一个 http 对象。

### 传递路径

http 对象会在下面的功能模块会中传递：

* `Behavior` 行为类
* `Controller` 控制器类

控制器类会在 init 方法里将传递过来的 http 对象赋值给 this.http。

```js
module.exports = Class({
    init: function(http){
        this.http = http;
    }
})
```

项目中的控制器类会继承控制器基类，如果要重写 init 方法，那么必须调用控制器基类的 init 方法，并将 http 对象传递过去。如：

```js
module.exports = Controller({
    init: function(http){
        this.super("init", http);
        // 其他逻辑
    }
})
```

### 处理的数据

http 对象里包含了很多处理用户请求的数据，如：cookie 数据，get 参数，post 内容，上传的文件等等。

#### cookie 数据

解析的 cookie 数据存放在 `http.cookie` 对象里，在 `Controller` 里直接通过 `cookie` 方法获取即可。

#### get 参数

解析的 get 参数存放在 `http.get` 对象里，在 `Controller` 里直接通过 `get` 方法获取即可。

#### post 内容

post 内容在不同的场景下可能有不同的数据格式，ThinkJS 提供多种的解析方式。

##### querystring 解析

ThinkJS 默认使用 querystring 的方式来解析 post 的内容，如：

```js
name=welefen&value=111
```

解析后的 post 数据为：

```js
{
    "name": "welefen",
    "value": "111"
}
```

##### json 解析

对于复杂的数据，querystring 解析就不合适了。这时候浏览器端可以传递一个 json 的数据格式，服务端也用 json 的方式来解析。

ThinkJS 支持在发送数据的时候指定特定的 `Content-Type` 来使用 json 解析，默认的 `Content-Type` 为 `application/json`。

可以通过下面的参数来修改：

```js
post_json_content_type: ['application/json'], //post 数据为 json 时的 content-type
```

配置值为数组，这样就可以指定多个 Content-Type 来使用 json 解析。

##### 自定义方式解析

ThinkJS 除了支持使用 querystring 和 json 的方式来解析 post 数据外，还可以使用自定义的方式解析。ThinkJS 是通过行为切面来完成这一功能的，具体的行为切面名称为 `form_parse`。

可以在项目的 App/Conf/tag.js 里指定行为切面 `form_parse` 对应的行为进行解析的工作。如：

```
// 解析 xml 格式的数据
var xmlParse = function(http){
    var postData = http.payload; //post 数据在 http.payload 里
    // 解析 xml 格式数据的逻辑，并将解析的结果返回
    // 返回的可以是个 promise
}
module.exports = {
    form_parse: [xmlParse]
}
```

#### 上传的文件

ThinkJS 支持表单文件上传和 ajax 文件上传 2 种方式，解析后的数据放在 `http.file` 对象里，`Controller` 里直接使用 file 方法获取即可。

##### 表单文件上传

表单文件上传可以指定如下的配置参数：
```js
post_max_file_size: 1024 * 1024 * 1024, // 上传文件大小限制，默认 1G
post_max_fields: 100, // 最大表单数，默认为 100
post_max_fields_size: 2 * 1024 * 1024, // 单个表单长度最大值，默认为 2MB
post_file_upload_path: APP_PATH + '/Runtime/Temp', // 文件上传的临时目录
```

##### ajax 文件上传

高级浏览器下支持使用 ajax 来上传单个文件，如：
```js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(e){ }
xhr.open("POST", '/admin/project/upload', true);
xhr.setRequestHeader("X-FILENAME", 'file');
xhr.send($('#fileField')[0].files[0]);
```
对于 ajax 上传的内容，ThinkJS 是通过下面的配置来判断上传的是否是文件：

```js
post_ajax_filename_header: 'x-filename', // 通过 ajax 上传文件时文件名对应的 header，如果有这个 header 表示是文件上传
```
该头信息的值作为具体的文件名来获取。

通过 ajax 上传的文件 filedName 固定为 file，在 Controller 中可以通过 `this.file("file")` 来获取。

获取到单个文件的信息如下：

```js
{
    fieldName: 'file',
    originalFilename: filename, // 原始文件文件名
    path: filepath, // 文件存放的临时目录
    size: fs.statSync(filepath).size // 文件大小
}
```

### 其他

#### 原始的 Request 和 Response 对象

http 是一个包装的对象，但保留了原始的 Request 和 Response 对象，可以通过 `http.req` 和 `http.res` 来获取。

比如：页面的 url 可以通过 `http.req.url` 来获取，对应在 Action 里就是 `this.http.req.url`