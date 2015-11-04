## 架构

### 模块化设计

ThinkJS 基于 `分组/控制器/操作` 的设计原则，一个典型的 URL 如下：

`http://hostname:port/分组/控制器/操作/参数名/参数值/参数名2/参数值 2?arg1=argv1&arg2=argv2`

* ` 分组 ` 一个应用下有多个分组，一个分组都是很独立的模块。比如：前台模块、用户模块、管理员模块
* ` 控制器 ` 一个分组下有多个控制器，一个控制器是多个操作的集合。如：商品的增删改查
* ` 操作 ` 一个控制器有多个操作，每个操作都是最小的执行单元。如：添加一个商品

项目中有哪些分组，需要在如下的配置中指定：

```js
// 支持的分组列表
'app_group_list': ['Home', 'Admin'], // 表示有 Home 和 Admin 2 个分组
```

默认是哪个分组，可以在下面的配置中指定：

```
// 默认分组
'default_group': 'Home', // 你可以将默认分组改成合适的，如：Blog
```


### CBD 模式

ThinkJS 使用 CBD(核心 Core+ 行为 Behavior+ 驱动 Driver) 的架构模式，核心保留了最关键的部分，并在重要位置添加了 `切面`，其他功能都是以驱动的方式来完成。

#### 核心 (Core)

ThinkJS 的核心部分包含通用函数库、系统默认配置、核心类库等组成，这些都是 ThinkJS 必不可少的部分。

```
lib/Common/common.js 通用函数库
lib/Common/extend.js js 原生对象的扩展
lib/Common/function.js 框架相关的函数库
lib/Conf/alias.js  系统类库别名，加载时使用
lib/Conf/config.js 系统默认配置
lib/Conf/debug.js debug 模式下的配置
lib/Conf/mode.js  不同模式下的配置
lib/Conf/tag.js  每个切面下的行为
lib/Lib/Core/App.js  应用核心库
lib/Lib/Core/Controller.js 控制器基类
lib/Lib/Core/Db.js  数据库基类
lib/Lib/Core/Dispatcher.js 路由分发类
lib/Lib/Core/Http.js 封装的 http 对象类
lib/Lib/Core/Model.js 模型基类
lib/Lib/Core/Think.js 框架类
lib/Lib/Core/View.js 视图类
lib/Lib/Util/Behavior.js 行为基类
lib/Lib/Util/Cache.js 缓存基类
lib/Lib/Util/Cookie.js cookie 类
lib/Lib/Util/Filter.js 数据过滤类
lib/Lib/Util/Session.js session 基类
lib/Lib/Util/Valid.js 验证类
```


#### 行为 (Behavior)
行为是 ThinkJS 扩展机制中一项比较关键的扩展，行为可以独立调用，也可以整合到标签 (tag) 里一起调用，行为是执行过程中一个动作或事件。如：路由检测是个行为、静态缓存检测也是个行为。

标签 (tag) 是一组行为的集合，是在系统执行过程中切面处调用的。与 `EventEmitter` 不同，标签里的行为是按顺序执行的，当前的行为通过 Promise 机制控制后面的行为是否被执行。

##### 系统标签位

当执行一个 http 请求时，会在对应的时机执行如下的标签位：

* `app_init` 应用初始化
* `path_info` 解析 path 路径
* `resource_check` 静态资源请求检测
* `route_check` 路由检测
* `app_begin` 应用开始
* `action_init` action 初始化
* `view_init` 视图初始化
* `view_template` 模版定位
* `view_parse` 模版解析
* `view_filter` 模版内容过滤
* `view_end` 视图结束
* `action_end` action 结束
* `app_end` 应用结束

在每一个标签位置都可以配置多个行为，系统的标签位行为如下：

```js
/**
 * 系统标签配置
 * 可以在 App/Conf/tag.js 里进行修改
 * @type {Object}
 */
module.exports = {
    // 应用初始化
    app_init: [],
    //pathinfo 解析
    path_info: [],
    // 静态资源请求检测
    resource_check: ['CheckResource'],
    // 路由检测
    route_check: ['CheckRoute'],
    // 应用开始
    app_begin: ['ReadHtmlCache'],
    //action 执行初始化
    action_init: [],
    // 模版解析初始化
    view_init: [],
    // 定位模版文件
    view_template: ["LocationTemplate"],
    // 模版解析
    view_parse: ["ParseTemplate"],
    // 模版内容过滤
    view_filter: [],
    // 模版解析结束
    view_end: ['WriteHtmlCache'],
    //action 结束
    action_end: [],
    // 应用结束
    app_end: []};
```

除了系统的标签位行为，开发人员也可以根据项目的需要自定义标签位行为。

自定义标签位行为文件在 `App/Conf/tag.js`。

##### 行为定义

行为定义有 2 种方式，一种是一个简单的 function，一种是较为复杂些的行为类。

可以通过下面直接 function 的方式创建一个简单的行为，文件为 `App/Conf/tag.js`：

```js
module.exports = {app_begin: [
    function(http){ // 会传递一个包装的 http 对象
        if (http.group !== 'Home') {
            return;
        };
        var userAgent = http.getHeader('user-agent').toLowerCase();
        var flag = ["iphone", "android"].some(function(item){
            return userAgent.indexOf(item) > -1;
        })
        if (flag) {
            http.group = "Mobile";
        }
    }]
}
```

该行为的作用是：如果当前的分组是 Home 并且是手机访问，那么将分组改为 Mobile。这样就可以对同一个 url，PC 和 Mobile 访问执行不同的逻辑，输出不同的内容。

也可以继承行为基类来实现：

```js
module.exports = Behavior(function(){
    return {
        run: function(){
            var http = this.http; // 基类中的 init 方法会自动把传递进来的 http 对象放在当前对象上。
            if (http.group !== 'Home') {
                return;
            };
            var userAgent = http.getHeader('user-agent').toLowerCase();
            var flag = ["iphone", "android"].some(function(item){
                return userAgent.indexOf(item) > -1;
            })
            if (flag) {
                http.group = "Mobile";
            }
        }
    }
})
```

将内容保存在 `App/Lib/Behavior/AgentBehavior.js` 文件中，并在 `App/Conf/tag.js` 中配置如下的内容：
```js
module.exports = {
    app_begin: ["Agent"]
}
```


使用哪种方式来创建行为可以根据行为里的逻辑复杂度来选择。


##### 行为执行顺序

默认情况下，自定义的行为会和系统的行为一起执行，并且自定义行为是追加到系统行为之后的。

如果想更改行为执行的顺序，可以通过下面的方式：

* `app_begin: [true, 'Agent']` 将数组的第一个值设置为 true, 表示自定义行为替换系统默认的行为，那么系统的默认行为则不在执行。
* `app_begin: [false, 'Agent']` 将数组的第一个值设置为 false, 表示自定义行为放在系统的默认行为之前执行。

##### 自定义标签位执行和行为执行

上面提到的标签位和行为会在 http 执行过程中自动被调用，同时标签和行为也可以手工调用：

```
// 执行 check_auto 标签位，
//http 为包装的 http 对象，在整个 http 执行过程中都可以获取到
//data 为传过去的数据， 如果行为里需要的是多个数据，那么这里应该传递个数组
tag("check_auth", http, data); 
// 执行 Agent 这个行为
B("Agent", http, data);
```


#### 驱动 (Driver)

除了核心和行为外，ThinkJS 里的很多功能都是通过驱动来实现的，如：Cache, Session, Db 等。

驱动包括：

* `lib/Lib/Driver/Cache` 缓存驱动
* `lib/Lib/Driver/Db` 数据库驱动
* `lib/Lib/Driver/Session` Session 驱动
* `lib/Lib/Driver/Socket` Socket 驱动
* `lib/Lib/Driver/Template` 模版引擎驱动

如果有些功能框架里还没实现，如：mssql 数据库，那么开发人员可以在项目里 `App/Lib/Driver/Db/` 里实现。

### 自动加载

Node.js 里虽然提供了 require 来加载模块，但对于应用内的文件加载并没有给出快捷的加载方式。为此 ThinkJS 实现了一套快速加载机制，这些快速加载的文件包含：

* 系统核心文件
* 行为文件
* 各种驱动文件

通过全局函数 `thinkRequire` 来调用。例如：

```js
// 调用这些文件时会自动到对应的一些目录下查找
var db = thinkRequire("mssqlDb"); 
var model = thinkRequire("userModel");
var behavior = thinkRequire("AgentBehavior");
```

这些文件具体包含：`xxxBehavior`, `xxxModel`, `xxxController`, `xxxCache`, `xxxDb`, `xxxTemplate`, `xxxSocket`, `xxxSession`

如果是这些之外的文件通过 `thinkRequire` 加载，那么会调用系统 require 函数。

### 系统流程

系统的执行流程分为启动服务和响应用户请求 2 块：

#### 启动服务

* 通过 `node index.js` 启动
* 调用系统入口文件 `think.js`
* 常量定义，获取 ThinkJS 的版本号
* 加载 `lib/Lib/Core/Think.js` 文件，调用 start 方法
* 加载系统的函数库、系统默认配置
* 捕获异常
* 加载项目函数库、配置文件、自定义路由配置、行为配置、额外的配置文件
* 合并 autoload 的查找路径列表，注册 autoload 机制
* 记录当前 Node.js 的进程 id
* 加载 `lib/Lib/Core/App.js` 文件，调用 run 方法
* 识别是否使用 cluster，开启 http 服务

#### 响应用户请求

* 用户发生了 url 访问
* 执行标签位 `form_parse`
* 发送 `X-Powered-By` 响应头信息，值为 ThinkJS 的版本号
* 执行标签位 `app_init`
* 执行标签位 `resource_check`，判断当前请求是否是静态资源类请求。静态资源类请求执行标签位 `resource_output`
* 执行标签位 `path_info`，获取修改后的 pathname
* 执行标签位 `route_check`，进行路由检测，识别对应的 Group, Controller, Action
* 执行标签位 `app_begin`，检测当前请求是否有静态化缓存
* 执行标签位 `action_init`，实例化 Controller
* 调用 `__before` 方法，如果存在的话
* 调用对应的 action 方法
* 调用 `__after` 方法，如果存在的话
* 执行标签位 `view_init`，初始化模版引擎
* 执行标签位 `view_template`, 查到模版文件的具体路径
* 执行标签位 `view_parse`，解析模版内容
* 执行标签位 `view_filter`，对解析后的内容进行过滤
* 执行标签位 `view_end`，模版渲染结束
* 执行标签位 `app_end`, 应用调用结束