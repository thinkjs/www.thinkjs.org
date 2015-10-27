## 控制器

控制器是分组下一类功能的集合，每个控制器是一个独立的类文件，每个控制器下有多个操作。

### 定义控制器

创建文件 `App/Lib/Controller/Home/ArticleController.js`，表示 Home 分组下有名为 Article 的控制器。文件内容如下：

```js
// 控制器文件定义
module.exports = Controller(function(){
    return {
        indexAction: function(){
            return this.diplay();
        },
        listAction: function(){
            return this.display();
        },
        detailAction: function(){
            var doc = this.get("doc");
        }
    }
});
```

控制器的名称采用驼峰法命名，且首字母大写。

控制器类必须继承于 Controller 或者 Controller 的子类，建议每个分组下都有个 `BaseController`，其他的 Controller 继承该分组下的 BaseController，如：

```js
// 继承 Home 分组下的 BaseController
module.exports = Controller("Home/BaseController", function(){
    return {
        indexAction: function(){

        }
    }
})
```

` 注意：` 这里的 `Home/BaseController` 不能只写成 `BaseController`，那样会导致 BaseController 文件找不到，必须要带上分组名称。


### 初始化方法

js 本身并没有在一个类实例化时自动调用某个方法，但 ThinkJS 实现一套自动调用的机制。自动调用的方法名为 `init`，如果类有 init 方法，那么这个类在实例化时会自动调用 init 方法。

为实现 init 方法调用的机制，ThinkJS 里所有的类都是通过 [Class](/api/global.html#class) 函数创建。

如果控制器里要重写 init 方法，那么必须调用父类的 init 方法，如：
```js
module.exports = Controller(function(){
    return {
        init: function(http){ 
            // 这里会传递一个包装后的 http 对象进来
            this.super("init", http); 
            // 调用父级的 init 方法，并将 http 作为参数传递过去
            // 额外的逻辑
        }
    }
})
```

这里说个技巧：一般系统后台都需要用户登录才能访问，但判断用户是否登录一般都是异步的，不可能在每个 Action 里都去判断是否已经登录。

这时候就可以在 init 方法里判断是否已经登录，并且把这个 promise 返回，后续的 action 执行则是在这个 then 之后执行。如：

```js
module.exports = Controller(function(){
    return {
        // 这里会传递一个包装后的 http 对象进来
        init: function(http){ 
            // 调用父级的 init 方法，并将 http 作为参数传递过去
            this.super("init", http); 
            //login 请求不判断当前是否已经登录
            if(http.action === 'login'){return;}
            // 通过获取 session 判断是否已经登录
            var self = this;
            return this.session("userInfo").then(function(data){
                if(isEmpty(data)){
                    // 如果未登录跳转到登录页。由于 redirect 方法返回的是个 pendding promise，那么后面的 action 方法并不会被执行
                    return self.redirect("/login"); 
                }else{
                    // 设置后，后面的 action 里直接通过 this.userInfo 就可以拿到登录用户信息了
                    self.userInfo = data;
                }
            })
        }
    }
})
```

### 前置和后置操作

ThinkJS 支持前置和后置操作，默认的方法名为 `__before` 和 `__after`，可以通过如下的配置修改：

```js
// 前置、后置配置名称
"before_action_name": "__before",
"after_action_name": "__after"
```

调用 `__before` 和 `__after` 方法时，会将当前请求的 action 传递过去。

```js
// 前置和后置操作
module.exports = Controller(function(){
    return {
        __before: function(action){
            console.log(action)
        },
        __after: function(action){
            console.log(action);
        }
    }
})
```

`__before`，`action`， `__after` 是通过 promise 的链式调用的，如果当前操作返回一个 reject promise 或者 pedding promise，那么则会阻止后面的执行。

### Action 参数自动绑定

请求参数的值，一般是在 action 里通过 get(name) 或者 post(name) 来获取，如：

```js
var name = this.get("name");
var value = this.post("value");
```

为了获取方便，ThinkJS 里提供了一种方便的获取参数的方式，将参数绑定到 Action 上，需要开启如下的配置：

```js
'url_params_bind': true // 该功能默认开启
```

开启后，就可以通过下面的方式来获取参数

```js
module.exports = Controller(function(){
    return {
        detailAction: function(id){
            // 参数绑定后，这里的参数 id 值即为传递过来的 id 值
            // 如：访问 /article/10 的话，这里的 id 值为 10
            // 这里可以是多个参数
        }
    }
})
```

<div class="alert alert-warning">
    ` 注意 `：参数绑定是通过将函数 toString 后解析形参字符串得到的，如果代码上线时将 js 压缩的话那么就不能使用该功能了。
</div>

### 空操作

空操作是指系统在找不到请求的操作方法的时候，会定位到空操作 (`__call`) 方法执行，利用这个机制，可以实现错误页面和一些 url 的优化。

默认空操作对应的方法名为 `__call`，可以通过下面的配置修改：

```js
// 空操作对应的方法
'call_method': '__call'
```

```js
// 空操作方法
module.exports = Controller(function(){
    return {
        __call: function(action){
            console.log(action);
        }
    }
})
```

如果控制器下没有空操作对应的方法，那么访问一个不存在的 url 时则会报错。

### 空控制器

空控制器是指系统找不到请求的控制器名称的时候，系统会尝试定位到一个默认配置的控制器上。配置如下：

```js
// 空控制器
// 表示当访问一个不存在的控制器时，会执行 Home 分组下 IndexController 下的_404Action 方法
// 如果指定的控制器或者方法不存在，则会报错
call_controller: "Home:Index:_404"
```

在 `Home/IndexController.js` 里定义 `_404Action` 方法：

```js
module.exports = Controller({
    _404Action: function(){
        this.status(404); // 发送 404 状态码
        this.end('not found');
    }
})
```

当然你也可以不输出 404 信息，而是输出一些推荐的内容，这些根据项目需要来进行。

### 常用方法

这里列举一些常用的方法，详细的可以去 [Api](/api/controller.html) 文档里查看。

* `get(key)` 获取 get 参数值
* `post(key)` 获取 post 参数值
* `file(key)` 获取 file 参数值
* `isGet()` 当前是否是 get 请求
* `isPost()` 当前是否是 post 请求
* `isAjax()` 是否是 ajax 请求
* `ip()` 获取请求用户的 ip
* `redirect(url)` 跳转到一个 url，返回一个 pedding promise 阻止后面的逻辑继续执行
* `echo(data)` 输出数据，会自动调用 JSON.stringify
* `end(data)` 结束当前的 http 请求
* `json(data)` 输出 json 数据，自动发送 json 相关的 Content-Type
* `jsonp(data)` 输出 jsonp 数据，请求参数名默认为 `callback`
* `success(data)` 输出一个正常的 json 数据，数据格式为 `{errno: 0, errmsg: "", data: data}`，返回一个 pedding promise 阻止后续继续执行
* `error(errno, errmsg, data)` 输出一个错误的 json 数据，数据格式为 `{errno: errno_value, errmsg: string, data: data}`，返回一个 pedding promise 阻止后续继续执行
* `download(file)` 下载文件
* `assign(name, value)` 设置模版变量
* `display()` 输出一个模版，返回一个 promise
* `fetch()` 渲染模版并获取内容，返回一个 prmose，内容需要在 promise then 里获取
* `cookie(name, value)` 获取或者设置 cookie
* `session(name, value)` 获取或者设置 session
* `header(name, value)` 获取或者设置 header
* `action(name, data)` 调用其他 Controller 的方法，可以跨分组


### 一些技巧

#### 将 promise 返回

Action 里一般会从多个地方拉取数据，如：从数据库中查询数据，这些接口一般都是异步的，并且包装成了 Promise。

我们知道，Promise 会通过 try{}catch(e){} 来捕获异常，然后传递到 catch 里。如：

```js
indexAction: function(){
    D('User').page(1).then(function(data){

    }).catch(function(error){
        //error 为异常信息
        console.log(error)
    })
}
```

如果不加 catch，那么出错后，我们将无法看到异常信息，这对调试是非常不方便的。并且有时候会从多个地方拉取数据，每个都加 catch 也极为不便。

为此，ThinkJS 会自动捕获异常，并打印到控制台。但需要在 action 将 Promise 返回，如：

```js
indexAction: function(){
    // 这里将 Promise return 后，如果有异常会打印到控制台里
    return D('User').page(1).then(function(){

    })
}
```

#### var self = this

JS 中，函数是作为一等公民存在的，所以经常有函数嵌套。这时候需要将 this 赋值给变量供内部使用。

在使用 ThinkJS 开发项目中，推荐使用 `self` 作为这个变量名。如：

```js
listAciton: function(){
    var self = this;
    return D('Group').select().then(function(data){
        self.success(data);
    })
}
```

