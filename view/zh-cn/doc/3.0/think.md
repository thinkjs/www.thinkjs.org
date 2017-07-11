## think 对象

框架中内置 `think` 全局对象，方便在项目中随时随地使用。

### think.app

`think.app` 为 Koa [Application](https://github.com/koajs/koa/blob/master/lib/application.js#L61) 对象的实例，系统启动时生成。

此外为 app 扩展了更多的属性。

* `think.app.think` 等同于 think 对象，方便有些地方传入了 app 对象，同时要使用 think 对象上的其他方法
* `think.app.modules` 模块列表，单模块项目下为空数组
* `think.app.controllers` 存放项目下的 controller 文件，便于后续快速调用
* `think.app.logics` 存放项目下的 logic 文件
* `think.app.models` 存放项目下的模型文件
* `think.app.services` 存放 service 文件
* `think.app.routers` 存放自定义路由配置
* `think.app.validators` 存放校验配置

如果想要查下这些属性具体的值，可以在 `appReady` 事件中进行。

```js
think.app.on('appReady', () => {
  console.log(think.app.controllers)
})
```

### API

think 对象上集成了 [think-helper](https://github.com/thinkjs/think-helper) 上的所有方法，所以可以通过 `think.xxx` 来使用这些方法。

#### think.env

当前运行环境，等同于 `think.app.env`，值在 `development.js` 之类的入口文件中定义。

#### think.isCli

是否为命令行调用。

#### think.version

当前 ThinkJS 的版本号。

#### think.Controller

控制器基类。

#### think.Logic

logic 基类。

#### think.controller(name, ctx, m)

* `name` {String} 控制器名称
* `ctx` {Object} Koa ctx 对象
* `m` {String} 模块名，多模块项目下使用

获取控制器的实例，不存在则报错。

#### think.beforeStartServer(fn)

* `fn` {Function} 要注册的函数名

服务启动之前要注册执行的函数，如果有异步操作，fn 需要返回 Promise。
