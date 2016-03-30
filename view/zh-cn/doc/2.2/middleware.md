## Middleware

当处理用户的请求时，需要经过很多处理，如：解析参数，判断是否静态资源访问，路由解析，页面静态化判断，执行操作，查找模版，渲染模版等。项目里根据需要可能还会增加其他的一些处理，如：判断 IP 是否在黑名单中，CSRF 检测等。

ThinkJS 里通过 middleware 来处理这些逻辑，每个逻辑都是一个独立的 middleware。在请求处理中埋很多 hook，每个 hook 串行执行一系列的 middleware，最终完成一个请求的逻辑处理。

### hook 列表

框架里包含的 hook 列表如下：

* `request_begin` 请求开始
* `payload_parse` 解析提交上来的数据
* `payload_validate` 验证提交的数据
* `resource` 静态资源请求处理
* `route_parse` 路由解析
* `logic_before` logic 处理之前
* `logic_after` logic 处理之后
* `controller_before` controller 处理之前
* `controller_after` controller 处理之后
* `view_before` 视图处理之前
* `view_template` 视图文件处理
* `view_parse` 视图解析
* `view_filter` 视图内容过滤
* `view_after` 视图处理之后
* `response_end` 请求响应结束

每个 hook 里调用多个 middleware 来完成处理，具体包含的 middleware 如下：

```js
export default {
  request_begin: [],
  payload_parse: ['parse_form_payload', 'parse_single_file_payload', 'parse_json_payload', 'parse_querystring_payload'],
  payload_validate: ['validate_payload'],
  resource: ['check_resource', 'output_resource'],
  route_parse: ['rewrite_pathname', 'parse_route'],
  logic_before: [],
  logic_after: [],
  controller_before: [],
  controller_after: [],
  view_before: [],
  view_template: ['locate_template'],
  view_parse: ['parse_template'],
  view_filter: [],
  view_after: [],
  response_end: []
};
```

### 配置 hook

hook 默认执行的 middleware 往往不能满足项目的需求，可以通过配置修改 hook 对应要执行的 middleware 来完成，hook 的配置文件为 `src/common/config/hook.js`。

```js
export default {
  payload_parse: ['parse_xml'], //解析 xml
}
```

上面的配置会覆盖掉默认的配置值。如果在原有配置上增加的话，可以通过下面的方式：

#### 在前面追加

可以通过配置 `prepend` 让 middleware 作为前置追加：

```js
export default {
  payload_parse: ['prepend', 'parse_xml'], //在前面追加解析 xml
}
```

#### 在后面追加

可以通过配置 `append` 让 middleware 作为后置追加：

```js
export default {
  payload_parse: ['append', 'parse_xml'], //在后面追加解析 xml
}
```

`注`：建议使用追加的方式配置 middleware，系统的 middleware 名称可能在后续的版本中有所修改。

### 执行 hook

可以通过 `think.hook` 方法执行一个对应的 hook，如：

```js
await think.hook('payload_parse', http, data); //返回的是一个 Promise
```

在含有 `http` 对象的类中可以直接使用 `this.hook` 来执行 hook，如：

```js
await this.hook('payload_parse', data);
```

### 创建 middleware 

ThinkJS 支持 2 种方式的 middleware，即：class 方式和 function 方式。可以根据 middleware 复杂度决定使用哪种方式。

#### class 方式

如果 middleware 需要执行的逻辑比较复杂，需要定义为 class 的方式。可以通过 `thinkjs` 命令来创建 middleware，在项目目录下执行如下的命令：

```sh
thinkjs middleware xxx
```

执行完成后，会看到对应的文件 `src/common/middleware/xxx.js`。

##### ES6 方式 ##### 

```js
'use strict';
/**
 * middleware
 */
export default class extends think.middleware.base {
  /**
   * run
   * @return {} []
   */
  run(){
    
  }
}
```

##### 动态创建类的方式

```js
'use strict';

/**
 * middleware
 */
module.exports = think.middleware({
  /**
   * run
   * @return {} []
   */
  run: function(){

  }
})
```

middleware 里会将 `http` 传递进去，可以通过 `this.http` 属性来获取。逻辑代码放在 `run` 方法执行，如果含有异步操作，需要返回一个 `Promise` 或者使用 `*/yield`。

#### function 方式

如果 middleware 要处理的逻辑比较简单，可以直接创建为函数的形式。这种 middleware 不建议创建成一个独立的文件，而是放在一起统一处理。

可以建立文件 `src/common/bootstrap/middleware.js`，该文件在服务启动时会自动被加载。可以在这个文件添加多个函数式的 middleware。如：

```js
think.middleware('parse_xml', async http => {
  let payload = await http.getPayload();
  if (!payload) {
    return;
  }
  ...
});
```

函数式的 middleware 会将 `http` 对象作为一个参数传递进去，如果 middleware 里含有异步操作，需要返回一个 `Promise` 或者使用 Generator Function。

以下是框架里解析 json payload 的实现：

```js
think.middleware('parse_json_payload', http => {
  let types = http.config('post.json_content_type');
  if (types.indexOf(http.type()) === -1) {
    return;
  }
  return http.getPayload().then(payload => {
    try{
      http._post = JSON.parse(payload);
    }catch(e){}
  });
});
```

### 解析后赋值

有些 middleware 可能会解析相关的数据，然后希望重新赋值到 `http` 对象上，如：解析传递过来的 xml 数据，但后续希望可以通过 `http.get` 方法来获取。

* `http._get` 用来存放 GET 参数值，http.get(xxx) 从该对象获取数据
* `http._post` 用来存放 POST 参数值，http.post(xxx) 从该对象获取数据
* `http._file` 用来存放上传的文件值，http.file(xxx) 从该对象获取数据

```js
think.middleware('parse_xml', async http => {
  let payload = await http.getPayload();
  if (!payload) {
    return;
  }
  return parseXML(payload).then(data => {
    http._post = data; //将解析后的数据赋值给 http._post，后续可以通过 http.post 方法来获取
  });
});
```

关于 `http` 对象更多信息请见 [API -> http](./api_http.html)。

### 阻止后续执行

有些 middleware 执行到一定条件时，可能希望阻止后面的逻辑继续执行。如：IP 黑名单判断，如果命中了黑名单，那么直接拒绝当前请求，不再执行后续的逻辑。

ThinkJS 提供了 `think.prevent` 方法用来阻止后续的逻辑执行执行，该方法是通过返回一个特定类型的 Reject Promise 来实现的。

```js
think.middleware('parse_xml', async http => {
  let payload = await http.getPayload();
  if (!payload) {
    return;
  }
  var ip = http.ip();
  var blackIPs = ['123.456.789.100', ...];
  if(blackIPs.indexOf(ip) > -1){
    http.end();//直接结束当前请求
    return think.prevent(); //阻止后续的代码继续执行
  }
});
```

除了使用 `think.prevent` 方法来阻止后续逻辑继续执行，也可以通过 `think.defer().promise` 返回一个 Pending Promise 来实现。

如果不想直接结束当前请求，而是返回一个错误页面，ThinkJS 提供了 `think.statusAction` 方法来实现，具体使用方式请见 [扩展功能 -> 错误处理](./error_handle.html)。

### 使用第三方 middleware

在项目里使用第三方 middleware 可以通过 `think.middleware` 方法来实现，相关代码存放在 `src/common/bootstrap/middleware.js` 里。如：

```js
var parseXML = require('think-parsexml');

think.middleware('parseXML', parseXML);
```

然后将 `parseXML` 配置到 hook 里即可。


-----

项目里的一些通用 middleware 也推荐发布到 npm 仓库中，middleware 名称推荐使用 `think-xxx`。

### 第三方 middleware 列表

第三方 middleware 列表请见 [插件 -> middleware](/plugin.html#middleware)。
