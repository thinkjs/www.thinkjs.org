## 介绍

ThinkJS 是一款使用 ES6/7 特性全新开发的 Node.js MVC 框架。该框架使用 ES7 中`async`和`await`，或者 ES6 中的`Generator Function`彻底解决了 Node.js 中异步嵌套的问题。同时吸收了国内外众多框架的设计理念和思想，让开发 Node.js 项目更加简单、高效。

使用 ES6/7 特性来开发项目可以大大提高开发效率，是趋势所在。并且新版的 Node.js 对 ES6 特性也有了较好的支持，即使有些特性还没有支持，也可以借助 [Babel](http://babeljs.io/) 编译工具来支持。


### 特性

#### 使用 ES6/7 特性来开发项目

在 ThinkJS 中，可以使用 ES6 里的`class`和`Generator Function`等特性，甚至可以使用 ES7 里的 `async` 和 `await` 等特性来开发项目。虽然最新的 Node.js 还不能全部支持这些特性，但可以借助 [Babel](http://babeljs.io/) 对代码进行编译，让其稳定运行在 Node.js 的环境中。

```js
//user controller, home/controller/user.js
export default class extends think.controller.base {
  //login action
  async loginAction(self){
    //如果是get请求，直接显示登录页面
    if(this.isGet()){
      return this.display();
    }
    //这里可以通过post方法获取所有的数据，数据已经在logic里做了校验
    let data = this.post();
    let md5 = think.md5('think_' + data.pwd);
    //用户名和加密后的密码去匹配数据库中对于的条目
    let result = await this.model('user').where({name: data.name, pwd: md5}).find();
    //如果未匹配到任何数据，表示用户名或者密码错误
    if(think.isEmpty(result)){
      return this.fail('login fail');
    }
    //获取到用户信息后，将用户信息写入session
    await this.session('userInfo', result);
    return this.success();
  }
}
```

上面的代码我们使用了 ES6 里的 `class`, `export`, `let` 以及 ES7 里的 `async` 和 `await` 等特性，虽然查询数据库和写入 `Session` 都是异步操作，但借助 `await`，代码都是同步书写的。最后使用 `Babel` 进行编译，就可以稳定运行在 Node.js 的环境中了。

如果不想使用 Babel 编译，但 Node.js 环境支持 `Generator Function`，那么可以使用 `yield`和 `*`。

```js
//user controller, home/controller/user.js
module.exports = think.controller({
  //login action
  loginAction: function *(self){
    //如果是get请求，直接显示登录页面
    if(this.isGet()){
      return this.display();
    }
    //这里可以通过post方法获取所有的数据，数据已经在logic里做了校验
    var data = this.post();
    var md5 = think.md5('think_' + data.pwd);
    //用户名和加密后的密码去匹配数据库中对于的条目
    var result = yield this.model('user').where({name: data.name, pwd: md5}).find();
    //如果未匹配到任何数据，表示用户名或者密码错误
    if(think.isEmpty(result)){
      return this.fail('login fail');
    }
    //获取到用户信息后，将用户信息写入session
    yield this.session('userInfo', result);
    return this.success();
  }
})
```

#### 支持丰富的数据库

ThinkJS 支持 `mysql`, `mongodb`, `sqlite` 等常见的数据库，并且封装了很多操作数据库的接口，自动防止 Sql 注入等安全漏洞。

#### 代码自动更新

ThinkJS 内置了一套代码自动更新的机制，文件修改后立即生效，不用重启 Node.js 服务，也不用借助第三方模块。

#### 自动创建 Rest 接口

使用 `thinkjs` 命令可以自动创建 Rest 接口，不用写任何的代码即可运行。如果想在 Rest 接口中过滤字段或者进行权限校验，也很方便处理。

#### 支持多种 WebSocket 库

ThinkJS 支持 `socket.io`，`sockjs` 等常见的 `websocket` 库，并且对这些库进行包装，抹平各个库之间接口调用上的差异，给开发者一致的体验。

#### 丰富的测试用例

ThinkJS 含有 1500+ 的测试用例，代码覆盖率达到 95% ，每一次修改都有对应的测试用例来保障框架功能的稳定。

#### 支持命令行调用执行定时任务

ThinkJS 里的 `Action`除了可以响应用户的请求，同时支持在命令行下访问。借助这套机制就可以很方便的执行定时任务。

#### Hook 和 Middleware

ThinkJS 使用 Hook 和 Middleware 机制，内置了大量的功能，同时也很方便进行扩展。

#### 详细的日志

ThinkJS 内置了详细的日志功能，可以很方便的查看各种日志，方便追查问题。

** HTTP 请求日志 **
```
[2015-10-12 14:10:03] [HTTP] GET /favicon.ico 200 5ms
[2015-10-12 14:10:11] [HTTP] GET /zh-CN/doc.html 200 11ms
[2015-10-12 14:10:11] [HTTP] GET /static/css/reset.css 200 3ms
```

** Socket 连接日志 **

```
[2015-10-12 14:13:54] [SOCKET] Connect mysql with mysql://root:root@127.0.0.1:3306
```

** 错误日志 **

```
[2015-10-12 14:15:32] [Error] Error: ER_ACCESS_DENIED_ERROR: Access denied for user 'root3'@'localhost' (using password: YES)

[2015-10-12 14:16:12] [Error] Error: Address already in use, port:8360. http://www.thinkjs.org/doc/error.html#EADDRINUSE
```

#### 支持国际化和多主题

ThinkJS 使用很简单的方法就可以支持国际化和多主题等功能。


### ES6/7 参考文档

关于 ES6/7 特性可以参考下面的文档：

* [ECMAScript 6 入门](http://es6.ruanyifeng.com/)
* [ECMAScript 6 Features](https://github.com/lukehoban/es6features)
* [ECMAScript 6 compatibility table](http://kangax.github.io/compat-table/es6/)
* [ECMAScript 7 Features](https://github.com/hemanth/es7-features)
* [ECMAScript 7 compatibility table](http://kangax.github.io/compat-table/es7/)

