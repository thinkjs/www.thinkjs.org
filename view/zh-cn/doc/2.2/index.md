## 介绍

ThinkJS 是一款使用 ES6/7 特性全新开发的 Node.js MVC 框架，使用 ES7 中 `async/await`，或者 ES6 中的 `*/yield` 特性彻底解决了 Node.js 中异步嵌套的问题。同时吸收了国内外众多框架的设计理念和思想，让开发 Node.js 项目更加简单、高效。

使用 ES6/7 特性来开发项目可以大大提高开发效率，是趋势所在。并且新版的 Node.js 对 ES6 特性也有了较好的支持，即使有些特性还没有支持，也可以借助 [Babel](http://babeljs.io/) 编译来支持。


### 特性

#### 使用 ES6/7 特性来开发项目

借助 Babel 编译，可以在项目中大胆使用 ES6/7 所有的特性，无需担心哪些特性当前版本不支持。尤其是使用 `async/await` 或者 `*/yield` 来解决异步回调的问题。

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
    //用户名去匹配数据库中对应的条目
    let result = await this.model('user').where({name: data.name}).find();
    if(!validateLogin(result)){
      return this.fail('login fail');
    }
    //获取到用户信息后，将用户信息写入session
    await this.session('userInfo', result);
    return this.success();
  }
}
```

上面的代码我们使用了 ES6 里的 `class`, `export`, `let` 以及 ES7 里的 `async/await` 等特性，虽然查询数据库和写入 `Session` 都是异步操作，但借助 `async/await`，代码都是同步书写的。最后使用 `Babel` 进行编译，就可以稳定运行在 Node.js 的环境中了。

#### 支持 TypeScript

[TypeScript](http://www.typescriptlang.org/) 是一种由微软开发的自由和开源的编程语言。它是 JavaScript 的一个超集，向这个语言添加了可选的静态类型，在大型项目里非常有用。

ThinkJS 2.1 开始支持了创建 TypeScript 类型的项目，并且开发时会自动编译、自动更新，无需手工编译等复杂的操作。具体请见[这里](./typescript.html)。

#### 断点调试

从 ThinkJS 2.2.0 版本开始，支持对 ES2015+ 和 TypeScript 项目的断点调试，并且报错信息也会定位到源代码下，这样可以给开发和调试带来巨大的便利，具体请见[断点调试](/doc/debug.html)。

#### 支持多种项目结构和多种项目环境

项目支持单模块模式、普通模式、分模块模式等多种项目结构，可以满足各种项目复杂度的开发。

默认支持 `development`，`testing` 和 `prodution` 3 种项目环境，可以在不同的项目环境下进行不同的配置，满足在不同环境下的配置需求，同时还可以基于项目需要进行扩展。


#### 支持丰富的数据库

ThinkJS 支持 `mysql`，`mongodb`，`sqlite` 等常见的数据库，并且封装了很多操作数据库的接口，无需手动拼接 SQL 语句，还可以自动防止 SQL 注入等安全漏洞。同时支持事务、关联模型等高级功能。

#### 代码自动更新

ThinkJS 内置了一套代码自动更新的机制，文件修改后立即生效，不用重启 Node.js 服务，也不用借助第三方模块。

#### 自动创建 REST 接口

使用 `thinkjs` 命令可以自动创建 REST 接口，不用写任何的代码即可完成 REST API 的开发。如果想在 REST 接口中过滤字段或者进行权限校验，也很方便处理。

#### 支持多种 WebSocket 库

ThinkJS 支持 `socket.io`，`sockjs` 等常见的 WebSocket 库，并且对这些库进行包装，抹平各个库之间接口调用上的差异，给开发者一致的体验。

#### 丰富的测试用例

ThinkJS 含有 1500+ 的测试用例，代码覆盖率达到 95% ，每一次修改都有对应的测试用例来保障框架功能的稳定。

#### 支持命令行调用执行定时任务

ThinkJS 里的 `Action` 除了可以响应用户的请求，同时支持在命令行下访问，借助这套机制就可以很方便的执行定时任务。

#### Hook 和 Middleware

ThinkJS 使用 Hook 和 Middleware 机制，可以灵活的对访问请求进行拦截处理。

#### 详细的日志

ThinkJS 内置了详细的日志功能，可以很方便的查看各种日志，方便追查问题。

##### HTTP 请求日志
```
[2015-10-12 14:10:03] [HTTP] GET /favicon.ico 200 5ms
[2015-10-12 14:10:11] [HTTP] GET /zh-cn/doc.html 200 11ms
[2015-10-12 14:10:11] [HTTP] GET /static/css/reset.css 200 3ms
```

##### Socket 连接日志

```
[2015-10-12 14:13:54] [SOCKET] Connect mysql with mysql://root:root@127.0.0.1:3306
```

##### 错误日志

```
[2015-10-12 14:15:32] [Error] Error: ER_ACCESS_DENIED_ERROR: Access denied for user 'root3'@'localhost' (using password: YES)

[2015-10-12 14:16:12] [Error] Error: Address already in use, port:8360. http://www.thinkjs.org/doc/error.html#EADDRINUSE
```

#### 丰富的路由机制

ThinkJS 支持正则路由、规则路由、静态路由等多种路由机制，并且可以基于模块来设置。可以让 URL 更加简洁的同时又不丢失性能。

#### 支持国际化和多主题

ThinkJS 使用很简单的方法就可以支持国际化和多主题等功能。

### 与其他框架的对比

#### 与 express/koa 对比

express/koa 是 2 个比较简单的框架，框架本身提供的功能比较简单，项目中需要借助大量的第三方插件才能完成项目的开发，所以灵活度比较高。但使用很多第三方组件一方面提高了项目的复杂度，另一方面第三方插件质量参差不齐，也会带来内存泄漏等风险。

koa 1.x 使用 ES6 里的 `*/yield` 解决了异步回调的问题，但 `*/yield` 只会是个过渡解决方案，会被 ES7 里的 `async/await` 所替代。

而 ThinkJS 提供了整套解决方案，每个功能都经过了严格的性能和内存泄漏等方面的测试，并且在项目中可以直接使用 ES6/7 所有的特性。

#### 与 sails 对比

sails 也是一个提供整套解决方案的 Node.js 框架，对数据库、REST API、安全方面也很多封装，使用起来比较方便。

但 sails 对异步回调的问题还没有优化，还是使用 callback 的方式，给开发带来很大的不便，导致项目中无法较好的使用 ES6/7 特性。


#### ThinkJS 的不足

上面说了很多 ThinkJS 的优点，当然 ThinkJS 也有很多的不足。如：

* 框架还比较新，缺少社区等方面的支持
* 还没有经过超大型项目的检验

#### 性能对比

评价一个框架是否出色，一方面看支持的功能，另一方面也要看性能。虽然 ThinkJS 更适合大型项目，功能和复杂度远远超过 Express 和 Koa，但性能上并不比 Express 和 Koa 逊色多少，具体的测试数据请见下图。

<img src="https://p.ssl.qhimg.com/t018bc14974bff742de.jpg" alt="ThinkJS 性能测试" style="max-width:100%">

`注`：以上数据使用分布式压力测试系统测试。


从上图中测试数据可以看到，虽然 ThinkJS 比 Express 和 Koa 性能要差一些，但差别并不大。ThinkJS 和 Sails.js 都更符合大型项目，但 ThinkJS 的性能要比 Sails.js 高很多。

具体测试代码请见：<https://github.com/thinkjs-team/thinkjs-performance-test>，可以下载代码在本机测试，如果使用 `ab` 测试工具，请注意该工具在 Mac 系统下很不稳定，多次测试结果会相差很大。

### ES6/7 参考文档

关于 ES6/7 特性可以参考下面的文档：

* [JavaScript Promise迷你书](http://liubin.github.io/promises-book/#ch2-promise-all)
* [learn-es2015](http://babeljs.io/docs/learn-es2015/)
* [ECMAScript 6 入门](http://es6.ruanyifeng.com/)
* [给 JavaScript 初心者的 ES2015 实战](http://gank.io/post/564151c1f1df1210001c9161)
* [ECMAScript 6 Features](https://github.com/lukehoban/es6features)
* [ECMAScript 6 compatibility table](http://kangax.github.io/compat-table/es6/)
* [ECMAScript 7 Features](https://github.com/hemanth/es7-features)
* [ECMAScript 7 compatibility table](http://kangax.github.io/compat-table/es7/)
