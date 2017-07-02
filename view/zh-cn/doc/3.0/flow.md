## 启动流程

本文档带领大家一起看看 ThinkJS 是如何启动服务的和处理用户请求的。

### 系统服务启动

* 执行 `npm start` 或者 `node development.js`
* 实例化 ThinkJS 里的 [Application](https://github.com/thinkjs/thinkjs/blob/3.0/lib/application.js) 类，执行 `run` 方法。
* 根据不同的环境（Master 进程、Worker 进程、命令行调用）处理不同的逻辑
* 如果是 Master 进程
    - 加载配置文件，生成 `think.config` 和 `think.logger` 对象。
    - 加载文件 `src/bootstrap/matser.js` 文件
    - 如果配置文件监听服务，那么开始监听文件的变化，目录为 `src/`。
    - 文件修改后，如果配置文件编译服务，那么会对文件进行编译，编译到 `app/` 目录下。
    - 根据配置 `workers` 来 fork 对应数目的 worker。worker 进程启动完成后，触发 `appReady` 事件。（可以通过 `think.app.on("appReady")` 来捕获）
    - 如果文件发生了新的修改，那么会触发编译，然后杀掉所有的 worker 进程并重新 fork。
* 如果是 Worker 进程
    - 加载配置文件，生成 `think.config` 和 `think.logger` 对象。
    - 加载 Extend，为框架提供更多的功能，配置文件为 `src/config/extend.js`。
    - 获取当前项目的模块列表，放在 `think.app.modules` 上，如果为单模块，那么值为空数组。
    - 加载项目里的 controller 文件（`src/controller/*.js`），放在 `think.app.controllers` 对象上。
    - 加载项目里的 logic 文件（`src/logic/*.js`），放在 `think.app.logics` 对象上。
    - 加载项目里的 model 文件（`src/model/*.js`），放在 `think.app.models` 对象上。
    - 加载项目里的 service 文件（`src/service/*.js`），放在 `think.app.services` 对象上。
    - 加载路由配置文件 `src/config/router.js`，放在 `think.app.routers` 对象上。
    - 加载校验配置文件 `src/config/validator.js`，放在 `think.app.validators` 对象上。
    - 加载 middleware 配置文件 `src/config/middleware.js`，并通过 `think.app.use` 方法注册。
    - 加载定时任务配置文件 `src/config/crontab.js`，并注册定时任务服务。
    - 加载 `src/bootstrap/worker.js` 启动文件。
    - 监听 process 里的 `onUncaughtException` 和 `onUnhandledRejection` 错误事件，并进行处理。可以在配置 `src/config.js` 自定义这二个错误的处理函数。
    - 等待 `think.beforeStartServer` 注册的启动前处理函数执行，这里可以注册一些服务启动前的事务处理。
    - 如果自定义了创建服务配置 `createServer`，那么执行这个函数 `createServer(port, host, callback)`
    - 如果没有自定义，则通过 `think.app.listen` 来启动服务。
    - 服务启动完成时，触发 `appReady` 事件，可以通过 `think.app.on("appReady")` 监听。
    - 创建的服务赋值给 `think.app.server` 对象。

服务启动后，会打印下面的日志：

```text
[2017-07-02 13:36:40.646] [INFO] - Server running at http://127.0.0.1:8360
[2017-07-02 13:36:40.649] [INFO] - ThinkJS version: 3.0.0-beta1
[2017-07-02 13:36:40.649] [INFO] - Enviroment: development
[2017-07-02 13:36:40.649] [INFO] - Workers: 8
```

### 用户请求处理

当用户请求服务时，会经过下面的步骤进行处理。

* 请求到达 webserver（如：nginx），通过反向代理将请求转发给 node 服务。如果直接通过端口访问 node 服务，那么就没有这一步了。
* node 服务接收用户请求，master 进程将请求转发给对应的 worker 进程。
* worker 进程通过注册的 middleware 来处理用户的请求：
    - [meta](https://github.com/thinkjs/think-meta) 来处理一些通用的信息，如：设置请求的超时时间、是否发送 ThinkJS 版本号、是否发送处理的时间等。
    - [resource](https://github.com/thinkjs/think-resource) 处理静态资源请求，静态资源都放在 `www/static/` 下，如果命中当前请求是个静态资源，那么这个 middleware 处理完后提前结束，不再执行后面的 middleware。
    - [trace](https://github.com/thinkjs/think-trace) 处理一些错误信息，开发环境下打印详细的错误信息，生产环境只是报一个通用的错误。
    - [payload](https://github.com/thinkjs/think-payload) 处理用户上传的数据，包含：表单数据、文件等。解析完成后将数据放在 `request.body` 对象上，方便后续读取。
    - [router](https://github.com/thinkjs/think-router) 解析路由，解析出请求处理对应的 Controller 和 Action，放在 `ctx.controller` 和 `ctx.action` 上，方便后续处理。如果项目是多模块结构，那么还有 `ctx.module`。
    - [logic](https://github.com/thinkjs/think-logic) 根据解析出来的 controller 和 action，调用 logic 里对应的方法。
        - 实例化 logic 类，并将 `ctx` 传递进去。如果不存在则直接跳过
        - 执行 `__before` 方法，如果返回 `false` 则不再执行后续所有的逻辑（提前结束处理）
        - 如果 `xxxAction` 方法存在则执行，结果返回 `false` 则不再执行后续所有的逻辑
        - 如果 `xxxAction` 方法不存在，则试图执行 `__call` 方法
        - 执行 `__after` 方法，如果返回 `false` 则不再执行后续所有的逻辑
        - 通过方法返回 `false` 来阻断后续逻辑的执行
    - [controller](https://github.com/thinkjs/think-controller) 根据解析出来的 controller 和 action，调用 controller 里的对应的方法。
        - 具体的调用策略和 logic 完全一致
        - 如果不存在，那么当前请求返回 404
        - action 执行完成时，可以将结果放在 `this.body` 属性上用户返回给用户。

可以看到，所有的用户请求处理都是通过 middleware 来完成的。具体的项目中，可以根据需求，组装更多的 middleware 来处理用户的请求。
