## Controller

 此文档表示控制器下接口，在子控制器下可以直接使用。

 如果想在 Controller 里的 Action 查看 http 相关功能，可以查看 [这里](/doc/http.html)。

### ip()

获取当前请求的用户 ip。

```js
testAction: function(){
    // 用户 ip
    var ip = this.ip();
}
```

如果项目部署在本地的话，返回的 ip 为 `127.0.0.1`。

### isGet()

判断当前请求是否是 get 请求。

```js
testAction: function(){
    // 如果是 get 请求直接渲染模版
    if(this.isGet()){
        return this.display();
    }
}
```

### isPost()

判断当前请求是否是 post 请求。

```js
testAction: function(){
    // 如果是 post 请求获取对应的数据
    if(this.isPost()){
        var data = this.post();
    }
}
```

### isMethod(method)

判断是否是一个特定类型的请求。

```js
testAction: function(){
    // 判断是否是 put 请求
    var isPut = this.isMethod("put");
    // 判断是否是 delete 请求
    var isDel = this.isMethod("delete");
}
```

http 支持的请求类型为：`GET`, `POST`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`, `PATCH`。

### isAjax(method)

判断是否是 ajax 类型的请求。

```js
testAction: function(){
    // 只判断是否是 ajax 请求
    var isAjax = this.isAjax();
    // 判断是否是 get 类型的 ajax 请求
    var isGetAjax = this.isAjax("get");
    // 判断是否是 post 类型的 ajax 请求
    var isPostAjax = this.isAjax("post");
}
```

### isWebSocket()

判断是否是 websocket 请求。

```js
testAction: function(){
    // 是否是 WebSocket 请求
    var isWS = this.isWebSocket();
}
```

### get(name)

获取 get 参数值，默认值为空字符串。

```js
testAction: function(){
    // 获取 name 值
    var name = this.get("name");
}
```

如果不传 `name`，则为获取所有的参数值。

```js
testAction: function(){
    // 获取所有的参数值
    // 如：{name: "welefen", "email": "welefen@gmail.com"}
    var data = this.get();
}
```

### post(name)

获取 post 过来的值，默认值为空字符串。

```js
testAction: function(){
    // 获取 post 值
    var name = this.post("name");
}
```

如果不传 `name`，则为获取所有的 post 值。

```js
testAction: function(){
    // 获取所有的 post 值
    // 如：{name: "welefen", "email": "welefen@gmail.com"}
    var data = this.post();
}
```

### param(name)

获取 get 或者 post 参数，优先从 post 里获取。等同于下面的方式：

```js
testAction: function(){
    // 这 2 种方式的结果是一样的
    var name = this.param("name");
    var name = this.post("name") || this.get("name");
}
```

### file(name)

获取上传的文件。

```js
testAction: function(){
    // 获取表单名为 image 上传的文件
    var file = this.file("image");
}
```

如果不传 `name`，那么获取所有上传的文件。

具体的文件格式见： <http://www.ThinkJS.org/doc/http.html# 上传的文件>

### header(name, value)

获取或者发送 header 信息。

#### 获取头信息

获取单个头信息

```js
// 获取单个头信息
testAction: function(){
    var value = this.header("accept");
}
```

获取所有的头信息

```js
// 获取所有的头信息
testAction: function(){
    var headers = this.header();
}
```

#### 设置头信息

设置单个头信息

```js
// 设置单个头信息
testAction: function(){
    this.header("Content-Type", "text/xml");
}
```

批量设置头信息

```js
testAction: function(){
    this.header({
        "Content-Type": "text/html",
        "X-Power": "test"
    })
}
```

### userAgent()

获取浏览器端传递过来的 userAgent。

```js
// 获取 userAgent
testAction: function(){
    var userAgent = this.userAgent();
}
```

### referer()

获取 referer。

```js
// 获取 referrer
testAction: function(){
    var referrer = this.referer();
}
```

### cookie(name, value, options)

获取或者设置 cookie

#### 获取 cookie

获取单个 cookie

```js
// 获取单个 cookie
testAction: function(){
    var name = this.cookie("name");
}
```

获取所有 cookie

```js
// 获取所有 cookie
testAction: function(){
    var cookies = this.cookie();
}
```

#### 设置 cookie

设置 cookie 默认会用如下的配置，可以在 `App/Conf/config.js` 里修改。

```js
// 设置 cookie 默认配置
cookie_domain: "", //cookie 有效域名
cookie_path: "/",   //cookie 路径
cookie_timeout: 0, //cookie 失效时间，0 为浏览器关闭，单位：秒
```

```js
// 设置 cookie
testAction: fucntion(){
    this.cookie("name", "welefen");
    // 修改发送 cookie 的选项
    this.cookie("value", "xxx", {
        domain: "",
        path: "/",
        httponly: true, //httponly
        secure: true, //https 下才发送 cookie 到服务端
        timeout: 1000 // 超时时间，单位秒
    })
}
```

### session(name, value)

获取或者设置 session。

#### 获取 session

```js
// 获取 session
testAction: function(){
    // 获取 session 是个异步的过程，返回一个 promise
    this.session("userInfo").then(function(data){
        if(isEmpty(data)){
            // 无用户数据
        }
    })
}
```

#### 设置 session

```js
testAction: function(){
    // 设置 session 也是异步操作
    this.session("userInfo", {name: "welefen"}).then(function(){

    })
}
```

#### 删除 session

```js
testAction: function(){
    // 不传任何参数表示删除 session，比如：用户退出的时候执行删除的操作
    this.session().then(function(){

    })
}
```

### redirect(url, code)

url 跳转。

* `code` 默认值为 302
* `return` 返回一个 pendding promise，阻止后面代码继续执行

```js
testAction: function(){
    var self = this;
    return this.session("userInfo").then(function(data){
        if(isEmpty(data)){
            // 如果用户未登录，则跳转到登录页面
            return self.redirect("/login");
        }
    })
}
```


### assign(name, value)

给模版变量赋值，或者读取已经赋值的模版变量。

#### 变量赋值

单个变量赋值

```js
testAction: function(){
    // 单个变量赋值
    this.assign("name", "value");
}
```

批量赋值

```js
testAction: function(){
    this.assign({
        name: "welefen",
        url: "http://www.ThinkJS.org/"
    })
}
```

#### 读取赋值变量

```js
testAction: function(){
    // 读取已经赋值的变量
    var value = this.assign("url");
}
```

### fetch(templateFile)

获取渲染后的模版文件内容。

* `templateFile` 需要渲染的模版文件路径
* `return` 返回一个 promise

模版文件路径寻找规则如下：

* 如果不传 templateFile，那么自动根据当前的 Group、Controller、Action 拼接模版文件路径
* 如果 templateFile 是个相对路径，那么自动追加 `VIEW_PATH`
* 如果 templateFile 是 `group:controller:action`，那么会进行解析再拼接成对应的模版文件路径
* 如果 templateFile 是个绝对路径，那么直接调用

```js
testAction: function(){
    this.assign('name', 'xxx');
    // 自动分析模版文件路径
    this.fetch().then(function(content){
        //content 为渲染后的内容
    });
    // 路径前面追加 VIEW_PATH
    this.fetch('home/test_a.html');
    // 绝对路径，直接调用
    this.fetch('/home/xxx/www/www.domain.com/ttt.html');
    // 调用其他分组下的模版文件
    this.fetch('home:group:detail');
    // 调用当前分组下其他的模版文件
    this.fetch('group:detail');
}
```

### display(templateFile)

输出渲染后的模版文件内容到浏览器。

* `templateFile` 需要渲染的模版文件路径
* `return` 返回一个 promise

`templateFile` 查找规则与 [fetch](#fetchtemplatefile) 方法的 `templateFile` 查找规则相同。


### action(action, data)

可以跨分组、跨控制器的 action 调用。

* `return` 返回一个 promise

```js
testAction: function(){
    // 调用相同分组下的控制器为 group，操作为 detail 方法
    var promise = this.action("group:detail", [10]);
    // 调用 admin 分组下的控制器为 group，操作为 list 方法
    var promise = this.action("admin:group:list", [10])
}
```

### jsonp(data)

jsonp 数据输出。

会自动发送 `Content-Type`，默认值为 `application/json`，可以在配置 `json_content_type` 中修改。

jsonp 的 callback 名称默认从参数名为 `callback` 中获取，可以在配置 `url_callback_name` 中修改。

callback 名称会自动做安全过滤，只保留 `\w\.` 字符。

```js
testAction: function(){
    this.jsonp({name: "xxx"});
}
```

假如当前请求为 `/test?callback=functioname`，那么输出为 `functioname({name: "xxx"})`。

` 注 `： 如果没有传递 callback 参数，那么以 json 格式输出。

### json(data)

json 数据输出。

会自动发送 `Content-Type`，默认值为 `application/json`，可以在配置 `json_content_type` 中修改。


### status(status)

发送状态码，默认为 404。

```js
// 发送 http 状态码
testAction: function(){
    this.status(403);
}
```

### echo(data, encoding)

输出数据，可以指定编码。

默认自动发送 `Content-Type`，值为 `text/html`。可以在配置 `tpl_content_type` 中修改，也可以设置 `auto_send_content_type = false` 来关闭发送 `Content-Type`。

* `data` 如果是数组或者对象，自动调用 JSON.stringify。如果不是字符串或者 Buffer，那么自动转化为字符串。 

```js
testAction: function(){
    this.echo({name: "welefen"});
}
```

### end(data, encoding)

结束当前的 http 请求数据输出。

如果是通过 `this.echo` 输出数据，那么在最后必须要调用 `this.end` 来结束输出。

* `data` 如果 data 不为空，那么自动调用 `this.echo` 来输出数据

```js
testAction: function(){
    this.end({name: "welefen"});
}
```

### type(ext)

发送 `Content-Type`。

* `ext` 如果是文件扩展名，那么自动查找该扩展名对应的 `Mime-Type`。

```js
testAction: function(){
    this.type("text/html");
    this.type("js"); // 自动查找 js 对应的 Mime-Type
    this.type("css"); // 自动查找 css 对应的 Mime-Type
}
```

### download(file, contentType, filename)

下载文件。

* `file` 要下载的文件路径
* `contentType` 要发送的 `Content-Type`, 如果没传，自动从文件扩展名里获取
* `filename` 下载的文件名
* `return` 返回一个 promise

```js
testAction: function(){
    var file = "/home/welefen/a.txt";
    this.download(file, 'text/html', '1.txt').then(function(){
        // 下载完成后可以在这里进行一些操作，如：将下载次数 +1
    });
}
```

### success(data)

输出一个错误号为 0 的数据。

* `return` 返回一个 pendding promise，阻止后面继续执行。

```js
testAction: function(){
    return this.success({email: "xxx@gmail.com"})
}
```

浏览器拿到的数据为：

```js
{
    errno: 0,
    errmsg: "",
    data: {email: "xxx@gmail.com"}
}
```

其中 `errno` 表示错误号（此时为 0），`errmsg` 表示错误信息（此时为空）。`data` 里存放具体数据。

会自动发送 `Content-Type`，默认值为 `application/json`，可以在配置 `json_content_type` 中修改。

其中 `errno` 和 `errmsg` 可以通过下面的配置修改：

```js
error_no_key: "errno", // 错误号的 key
error_msg_key: "errmsg", // 错误信息的 key
```


### error(errno, errmsg, data)

输出一个 errno > 0 的信息。

* `errno` 错误号，默认为 1000，可以通过配置 `error_no_default_value` 修改
* `errmsg` 错误信息，字符串
* `data` 额外的数据
* `return` 返回一个 pedding promise，阻止后续继续执行

```js
// 输出一个错误信息
testAction: function(){
    return this.error(1001, "参数不合法");
}
```

浏览器拿到的数据为：

```js
{
    errno: 1001,
    errmsg: "参数不合法"
}
```

也可以值输出错误信息，那么错误号为配置 `error_no_default_value` 的值。

```js
testAction: function(){
    return this.error("参数不合法");
}
```

浏览器拿到的数据为：

```js
{
    errno: 1000,
    errmsg: "参数不合法"
}
```

也可以传个对象进去，如：

```js
testAction: function(){
    return this.error({
        errno: 10001,
        errmsg: "参数不合法"
    })
}
```

### filter(value, type)

变量过滤器，具体请见 [这里](./data_filter.html)。

### valid(data, type)

数据校验，具体请见 [这里](./data_valid.html)。
